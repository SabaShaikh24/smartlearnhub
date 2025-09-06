/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import express from 'express';
import fetch from 'node-fetch';
import Fuse from 'fuse.js';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js';


const router = express.Router();

const FETCH_OPTIONS = {
    headers: {
        'User-Agent': 'BSc-CS-IT-Notes-App/1.0 (your-email@gmail.com)',
        'Accept': 'application/json',
    }
};


router.get('/uploaded-notes', async (req, res) => {
    try {
        const { subjectId } = req.query;

        if (!subjectId) {
            return res.status(400).json({ error: 'subjectId is required' });
        }
        const notes = await Note.find({ subject: subjectId }).populate("user", "name email");


        // Get user-uploaded notes for this subject
        // eslint-disable-next-line no-undef
        const uploadedNotes = await Note.find({ subject: subjectId })
            .populate('user', 'name')
            .populate('subject', 'name')
            .sort({ createdAt: -1 });
        const host = `${req.protocol}://${req.get('host')}`;
        // Format the notes for frontend
        const formattedNotes = uploadedNotes.map(note => ({
            _id: note._id,
            title: note.title,
            uploader: note.user.name,
            date: note.createdAt.toISOString().split('T')[0],
            topic: note.subject.name,
            description: note.content,
            type: 'Uploaded Note',
            
            link: note.filePath ? `/api/notes/view/${note._id}` : null,
            source: 'peer',
            rating: 4,
            organized: true,
            subject: note.subject.name,
            semester: getSemester(note.subject.name),
            isExternal: false,
            downloadPath: note.filePath,
            originalFileName: note.originalFileName
        }));

        res.json({
            success: true,
            notes: formattedNotes,
            count: formattedNotes.length
        });

    } catch (err) {
        console.error('Error fetching uploaded notes:', err.message);
        res.status(500).json({ error: 'Failed to load uploaded notes' });
    }
});

// Proper mapping of BSc CS/IT subjects to relevant educational resources
const SUBJECT_TO_RESOURCES = {
    // SEMESTER 1 - CS
    'computer organization and design': {
        type: 'theory',
        resources: [
            {
                title: 'Computer Organization & Architecture Tutorials',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/computer_logical_organization/index.htm',
                description: 'Complete COA tutorials with diagrams and examples'
            },
            {
                title: 'Computer Organization Notes',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/',
                description: 'GfG COA tutorials for college students'
            }
        ]
    },
    'programming with python i': {
        type: 'programming',
        resources: [
            {
                title: 'Python Programming Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/python/',
                description: 'Beginner-friendly Python tutorial with examples'
            },
            {
                title: 'Learn Python Programming',
                source: 'Programiz',
                link: 'https://www.programiz.com/python-programming',
                description: 'Step-by-step Python learning path'
            }
        ]
    },
    'free and open-source software': {
        type: 'theory',
        resources: [
            {
                title: 'Introduction to FOSS',
                source: 'Opensource.com',
                link: 'https://opensource.com/resources/what-open-source',
                description: 'Understanding free and open-source software'
            },
            {
                title: 'FOSS Fundamentals',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/open-source-free-software/',
                description: 'FOSS concepts and examples'
            }
        ]
    },
    'database system': {
        type: 'theory',
        resources: [
            {
                title: 'DBMS Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/dbms-tutorial',
                description: 'Complete DBMS tutorial with SQL examples'
            },
            {
                title: 'Database Management System',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/dbms/',
                description: 'DBMS concepts and interview questions'
            }
        ]
    },
    'discrete mathematics': {
        type: 'mathematics',
        resources: [
            {
                title: 'Discrete Mathematics Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/discrete_mathematics/index.htm',
                description: 'Complete discrete math course material'
            },
            {
                title: 'Discrete Mathematics',
                source: 'JugglerShu',
                link: 'https://www.juggler.sh/discrete-math/',
                description: 'University-level discrete math notes'
            }
        ]
    },
    'descriptive statistics & introduction': {
        type: 'mathematics',
        resources: [
            {
                title: 'Descriptive Statistics',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data',
                description: 'Introduction to descriptive statistics'
            },
            {
                title: 'Statistics Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/statistics/index.php',
                description: 'Statistics concepts and examples'
            }
        ]
    },
    'soft skills development': {
        type: 'general',
        resources: [
            {
                title: 'Soft Skills Guide',
                source: 'Indeed',
                link: 'https://www.indeed.com/career-advice/resumes-cover-letters/soft-skills',
                description: 'Developing essential soft skills'
            },
            {
                title: 'Communication Skills',
                source: 'MindTools',
                link: 'https://www.mindtools.com/pages/article/newCS_99.htm',
                description: 'Improving communication abilities'
            }
        ]
    },

    // SEMESTER 2 - CS
    'programming with c': {
        type: 'programming',
        resources: [
            {
                title: 'C Programming Language Tutorial',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/c-programming-language/',
                description: 'Complete C programming tutorial'
            },
            {
                title: 'Learn C Programming',
                source: 'Programiz',
                link: 'https://www.programiz.com/c-programming',
                description: 'C programming with examples and exercises'
            }
        ]
    },
    'green technologies': {
        type: 'theory',
        resources: [
            {
                title: 'Green Computing',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/green-computing/',
                description: 'Eco-friendly computing technologies'
            },
            {
                title: 'Sustainable IT',
                source: 'TechTarget',
                link: 'https://www.techtarget.com/whatis/definition/green-IT-green-information-technology',
                description: 'Green IT concepts and practices'
            }
        ]
    },
    'data structures': {
        type: 'programming',
        resources: [
            {
                title: 'Data Structures Tutorial',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/data-structures/',
                description: 'Complete data structures guide with implementations'
            },
            {
                title: 'Data Structures and Algorithms',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/data-structure-tutorial',
                description: 'DSA tutorials with examples'
            }
        ]
    },
    'calculus': {
        type: 'mathematics',
        resources: [
            {
                title: 'Calculus Tutorial',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/math/calculus-1',
                description: 'Comprehensive calculus course'
            },
            {
                title: 'Calculus for Beginners',
                source: 'MIT OpenCourseWare',
                link: 'https://ocw.mit.edu/courses/mathematics/18-01sc-single-variable-calculus-fall-2010/',
                description: 'University-level calculus materials'
            }
        ]
    },
    'programming with python ii': {
        type: 'programming',
        resources: [
            {
                title: 'Advanced Python Tutorial',
                source: 'Real Python',
                link: 'https://realpython.com/tutorials/advanced/',
                description: 'Advanced Python programming concepts'
            },
            {
                title: 'Python OOP Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/python/python_classes.asp',
                description: 'Object-oriented programming in Python'
            }
        ]
    },
    'statistical methods and testing of hypothesis': {
        type: 'mathematics',
        resources: [
            {
                title: 'Hypothesis Testing',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample',
                description: 'Understanding hypothesis testing'
            },
            {
                title: 'Statistical Methods',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/statistics/statistical_methods.htm',
                description: 'Statistical methods and applications'
            }
        ]
    },
    'linux': {
        type: 'operating system',
        resources: [
            {
                title: 'Linux/Unix Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/unix/index.htm',
                description: 'Complete Linux command line tutorial'
            },
            {
                title: 'Linux Journey',
                source: 'Linux Journey',
                link: 'https://linuxjourney.com/',
                description: 'Interactive Linux learning platform'
            }
        ]
    },

    // SEMESTER 3 - CS
    'operating system': {
        type: 'theory',
        resources: [
            {
                title: 'Operating System Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/os-tutorial',
                description: 'Complete OS concepts with diagrams'
            },
            {
                title: 'Operating System Notes',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/operating-systems/',
                description: 'OS concepts and interview preparation'
            }
        ]
    },
    'combinatorics and graph theory': {
        type: 'mathematics',
        resources: [
            {
                title: 'Graph Theory Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/graph_theory/index.htm',
                description: 'Graph theory concepts and applications'
            },
            {
                title: 'Combinatorics Resources',
                source: 'MIT OpenCourseWare',
                link: 'https://ocw.mit.edu/courses/18-314-combinatorial-analysis-fall-2014/',
                description: 'University-level combinatorics course'
            }
        ]
    },
    'web programming': {
        type: 'programming',
        resources: [
            {
                title: 'Web Development Tutorial',
                source: 'MDN Web Docs',
                link: 'https://developer.mozilla.org/en-US/docs/Learn',
                description: 'Professional web development tutorials'
            },
            {
                title: 'Full Stack Web Development',
                source: 'FreeCodeCamp',
                link: 'https://www.freecodecamp.org/learn/',
                description: 'Interactive web development courses'
            }
        ]
    },
    'database management systems': {
        type: 'theory',
        resources: [
            {
                title: 'DBMS Complete Guide',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/dbms/',
                description: 'Advanced DBMS concepts and SQL'
            },
            {
                title: 'Database Management Systems',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/dbms/index.htm',
                description: 'DBMS tutorial with examples'
            }
        ]
    },
    'core java': {
        type: 'programming',
        resources: [
            {
                title: 'Java Programming Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/java-tutorial',
                description: 'Complete Java tutorial for beginners'
            },
            {
                title: 'Learn Java Programming',
                source: 'Programiz',
                link: 'https://www.programiz.com/java-programming',
                description: 'Java programming with examples'
            }
        ]
    },
    'theory of computation': {
        type: 'theory',
        resources: [
            {
                title: 'Theory of Computation',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/theory-of-computation/',
                description: 'Automata theory and formal languages'
            },
            {
                title: 'ToC Lecture Notes',
                source: 'Stanford University',
                link: 'https://cs.stanford.edu/people/eroberts/courses/soco/projects/2004-05/automata-theory/',
                description: 'University-level theory of computation notes'
            }
        ]
    },
    'physical computing and iot programming': {
        type: 'programming',
        resources: [
            {
                title: 'IoT Programming Guide',
                source: 'IoT For All',
                link: 'https://www.iotforall.com/',
                description: 'Internet of Things development resources'
            },
            {
                title: 'Physical Computing',
                source: 'Make: Magazine',
                link: 'https://makezine.com/category/electronics/physical-computing/',
                description: 'Physical computing projects and tutorials'
            }
        ]
    },

    // SEMESTER 4 - CS
    'computer networks': {
        type: 'theory',
        resources: [
            {
                title: 'Computer Network Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/computer-network-tutorial',
                description: 'Complete computer networks tutorial'
            },
            {
                title: 'Computer Networks Notes',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/computer-network-tutorials/',
                description: 'Networking concepts and protocols'
            }
        ]
    },
    'linear algebra using python': {
        type: 'mathematics',
        resources: [
            {
                title: 'Linear Algebra with Python',
                source: 'NumPy',
                link: 'https://numpy.org/doc/stable/reference/routines.linalg.html',
                description: 'Linear algebra operations using NumPy'
            },
            {
                title: 'Linear Algebra Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/numpy/numpy_linear_algebra.htm',
                description: 'Matrix operations with Python'
            }
        ]
    },
    'android developer fundamentals': {
        type: 'programming',
        resources: [
            {
                title: 'Android Developer Guide',
                source: 'Android Developers',
                link: 'https://developer.android.com/guide',
                description: 'Official Android development documentation'
            },
            {
                title: 'Android Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/android/index.htm',
                description: 'Android app development tutorial'
            }
        ]
    },
    'advanced java': {
        type: 'programming',
        resources: [
            {
                title: 'Advanced Java Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/advanced-java-tutorial',
                description: 'J2EE, Servlets, JSP, and frameworks'
            },
            {
                title: 'Java Enterprise Edition',
                source: 'Oracle',
                link: 'https://docs.oracle.com/javaee/7/tutorial/',
                description: 'Official Java EE tutorial'
            }
        ]
    },
    '.net technology': {
        type: 'programming',
        resources: [
            {
                title: '.NET Documentation',
                source: 'Microsoft',
                link: 'https://docs.microsoft.com/en-us/dotnet/',
                description: 'Official .NET framework documentation'
            },
            {
                title: '.NET Tutorial',
                source: 'TutorialsTeacher',
                link: 'https://www.tutorialsteacher.com/dotnet',
                description: '.NET programming tutorials'
            }
        ]
    },
    'fundamentals of algorithms': {
        type: 'programming',
        resources: [
            {
                title: 'Algorithms Tutorial',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
                description: 'Algorithm design and analysis'
            },
            {
                title: 'Introduction to Algorithms',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/computing/computer-science/algorithms',
                description: 'Algorithm fundamentals course'
            }
        ]
    },
    'software engineering': {
        type: 'theory',
        resources: [
            {
                title: 'Software Engineering Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/software_engineering/index.htm',
                description: 'Software development lifecycle and methodologies'
            },
            {
                title: 'Software Engineering',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/software-engineering/',
                description: 'SE concepts and best practices'
            }
        ]
    },

    // SEMESTER 5 - CS
    'software testing & quality assurance': {
        type: 'theory',
        resources: [
            {
                title: 'Software Testing Tutorial',
                source: 'Guru99',
                link: 'https://www.guru99.com/software-testing.html',
                description: 'Complete software testing guide'
            },
            {
                title: 'Quality Assurance Basics',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/software_testing_dictionary/quality_assurance.htm',
                description: 'QA principles and practices'
            }
        ]
    },
    'web services': {
        type: 'programming',
        resources: [
            {
                title: 'Web Services Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/web-services-tutorial',
                description: 'SOAP and REST web services'
            },
            {
                title: 'REST API Tutorial',
                source: 'REST API Tutorial',
                link: 'https://restfulapi.net/',
                description: 'Building RESTful web services'
            }
        ]
    },
    'artificial intelligence': {
        type: 'theory',
        resources: [
            {
                title: 'AI Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/artificial-intelligence-tutorial',
                description: 'Artificial intelligence concepts and algorithms'
            },
            {
                title: 'Artificial Intelligence',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/artificial-intelligence/',
                description: 'AI and machine learning tutorials'
            }
        ]
    },
    'information & network security': {
        type: 'theory',
        resources: [
            {
                title: 'Network Security Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/network_security/index.htm',
                description: 'Cryptography and security protocols'
            },
            {
                title: 'Cyber Security Tutorial',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/cyber-security-tutorial/',
                description: 'Information security concepts'
            }
        ]
    },
    'linux server administration': {
        type: 'operating system',
        resources: [
            {
                title: 'Linux Server Administration',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/linux_admin/index.htm',
                description: 'Linux server management guide'
            },
            {
                title: 'Linux Administration',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/linux-system-administration/',
                description: 'Linux admin commands and concepts'
            }
        ]
    },
    'architecture of iot': {
        type: 'theory',
        resources: [
            {
                title: 'IoT Architecture Guide',
                source: 'IoT For All',
                link: 'https://www.iotforall.com/iot-architecture',
                description: 'IoT system architecture and components'
            },
            {
                title: 'IoT Reference Architecture',
                source: 'IEEE',
                link: 'https://iot.ieee.org/images/files/pdf/iot_architecture_overview.pdf',
                description: 'Standard IoT architecture models'
            }
        ]
    },
    'game programming': {
        type: 'programming',
        resources: [
            {
                title: 'Game Development Tutorial',
                source: 'Unity Learn',
                link: 'https://learn.unity.com/',
                description: 'Unity game development courses'
            },
            {
                title: 'Game Programming Patterns',
                source: 'Game Programming Patterns',
                link: 'https://gameprogrammingpatterns.com/',
                description: 'Game development design patterns'
            }
        ]
    },

    // SEMESTER 6 - CS
    'wireless sensor networks & mobile communication': {
        type: 'theory',
        resources: [
            {
                title: 'Wireless Sensor Networks',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/wireless_sensor_network/index.htm',
                description: 'WSN concepts and applications'
            },
            {
                title: 'Mobile Communications',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/mobile-communication/',
                description: 'Mobile communication technologies'
            }
        ]
    },
    'information retrieval': {
        type: 'theory',
        resources: [
            {
                title: 'Information Retrieval Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/information_retrieval/index.htm',
                description: 'IR concepts and search algorithms'
            },
            {
                title: 'Introduction to IR',
                source: 'Stanford University',
                link: 'https://web.stanford.edu/class/cs276/',
                description: 'Information retrieval course materials'
            }
        ]
    },
    'ethical hacking': {
        type: 'theory',
        resources: [
            {
                title: 'Ethical Hacking Tutorial',
                source: 'Guru99',
                link: 'https://www.guru99.com/ethical-hacking-tutorials.html',
                description: 'Ethical hacking and penetration testing'
            },
            {
                title: 'Cybersecurity Essentials',
                source: 'Cisco Networking Academy',
                link: 'https://www.netacad.com/courses/cybersecurity/cybersecurity-essentials',
                description: 'Cybersecurity fundamentals course'
            }
        ]
    },
    'digital image processing': {
        type: 'programming',
        resources: [
            {
                title: 'Digital Image Processing Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/dip/index.htm',
                description: 'Image processing concepts and techniques'
            },
            {
                title: 'Image Processing with Python',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/image-processing-in-python/',
                description: 'Python image processing tutorials'
            }
        ]
    },
    'data science': {
        type: 'programming',
        resources: [
            {
                title: 'Data Science Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/datascience/',
                description: 'Data science with Python and R'
            },
            {
                title: 'Data Science Fundamentals',
                source: 'FreeCodeCamp',
                link: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
                description: 'Data analysis and visualization'
            }
        ]
    },
    'cloud computing': {
        type: 'theory',
        resources: [
            {
                title: 'Cloud Computing Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/cloud-computing-tutorial',
                description: 'Cloud computing concepts and services'
            },
            {
                title: 'Cloud Computing',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/cloud-computing/',
                description: 'Cloud technologies and platforms'
            }
        ]
    },

    // BSc IT SUBJECTS
    // SEMESTER 1 - IT
    'imperative programming': {
        type: 'programming',
        resources: [
            {
                title: 'Imperative Programming Guide',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/imperative-programming/',
                description: 'Imperative programming concepts'
            },
            {
                title: 'C Programming Tutorial',
                source: 'Programiz',
                link: 'https://www.programiz.com/c-programming',
                description: 'C language for imperative programming'
            }
        ]
    },
    'digital electronics': {
        type: 'theory',
        resources: [
            {
                title: 'Digital Electronics Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/digital_electronics/index.htm',
                description: 'Digital circuits and logic design'
            },
            {
                title: 'Digital Electronics',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/digital-electronics-logic-design-tutorials/',
                description: 'Digital logic and circuit design'
            }
        ]
    },
    'operating systems': {
        type: 'theory',
        resources: [
            {
                title: 'Operating System Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/os-tutorial',
                description: 'Complete OS concepts with diagrams'
            },
            {
                title: 'Operating System Notes',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/operating-systems/',
                description: 'OS concepts and interview preparation'
            }
        ]
    },
    'discrete mathematics': {
        type: 'mathematics',
        resources: [
            {
                title: 'Discrete Mathematics Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/discrete_mathematics/index.htm',
                description: 'Complete discrete math course material'
            },
            {
                title: 'Discrete Mathematics',
                source: 'JugglerShu',
                link: 'https://www.juggler.sh/discrete-math/',
                description: 'University-level discrete math notes'
            }
        ]
    },
    'communication skills': {
        type: 'general',
        resources: [
            {
                title: 'Communication Skills Guide',
                source: 'MindTools',
                link: 'https://www.mindtools.com/pages/article/newCS_99.htm',
                description: 'Improving communication abilities'
            },
            {
                title: 'Effective Communication',
                source: 'SkillsYouNeed',
                link: 'https://www.skillsyouneed.com/ips/communication-skills.html',
                description: 'Developing communication skills'
            }
        ]
    },

    // SEMESTER 2 - IT
    'object-oriented programming': {
        type: 'programming',
        resources: [
            {
                title: 'OOP Concepts',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/',
                description: 'Object-oriented programming principles'
            },
            {
                title: 'Java OOP Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/java/java_oop.asp',
                description: 'OOP implementation in Java'
            }
        ]
    },
    'microprocessor architecture': {
        type: 'theory',
        resources: [
            {
                title: 'Microprocessor Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/microprocessor/index.htm',
                description: 'Microprocessor architecture and programming'
            },
            {
                title: 'Microprocessor Basics',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/microprocessor-tutorials/',
                description: 'Microprocessor concepts and applications'
            }
        ]
    },
    'web programming': {
        type: 'programming',
        resources: [
            {
                title: 'Web Development Tutorial',
                source: 'MDN Web Docs',
                link: 'https://developer.mozilla.org/en-US/docs/Learn',
                description: 'Professional web development tutorials'
            },
            {
                title: 'Full Stack Web Development',
                source: 'FreeCodeCamp',
                link: 'https://www.freecodecamp.org/learn/',
                description: 'Interactive web development courses'
            }
        ]
    },
    'numerical and statistical methods': {
        type: 'mathematics',
        resources: [
            {
                title: 'Numerical Methods',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/numerical_methods/index.htm',
                description: 'Numerical methods and algorithms'
            },
            {
                title: 'Statistical Methods',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/math/statistics-probability',
                description: 'Statistical concepts and applications'
            }
        ]
    },
    'green computing': {
        type: 'theory',
        resources: [
            {
                title: 'Green Computing',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/green-computing/',
                description: 'Eco-friendly computing technologies'
            },
            {
                title: 'Sustainable IT',
                source: 'TechTarget',
                link: 'https://www.techtarget.com/whatis/definition/green-IT-green-information-technology',
                description: 'Green IT concepts and practices'
            }
        ]
    },

    // SEMESTER 3 - IT
    'python programming': {
        type: 'programming',
        resources: [
            {
                title: 'Python Programming Tutorial',
                source: 'W3Schools',
                link: 'https://www.w3schools.com/python/',
                description: 'Beginner-friendly Python tutorial with examples'
            },
            {
                title: 'Learn Python Programming',
                source: 'Programiz',
                link: 'https://www.programiz.com/python-programming',
                description: 'Step-by-step Python learning path'
            }
        ]
    },
    'data structures': {
        type: 'programming',
        resources: [
            {
                title: 'Data Structures Tutorial',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/data-structures/',
                description: 'Complete data structures guide with implementations'
            },
            {
                title: 'Data Structures and Algorithms',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/data-structure-tutorial',
                description: 'DSA tutorials with examples'
            }
        ]
    },
    'computer networks': {
        type: 'theory',
        resources: [
            {
                title: 'Computer Network Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/computer-network-tutorial',
                description: 'Complete computer networks tutorial'
            },
            {
                title: 'Computer Networks Notes',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/computer-network-tutorials/',
                description: 'Networking concepts and protocols'
            }
        ]
    },
    'database management systems': {
        type: 'theory',
        resources: [
            {
                title: 'DBMS Complete Guide',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/dbms/',
                description: 'Advanced DBMS concepts and SQL'
            },
            {
                title: 'Database Management Systems',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/dbms/index.htm',
                description: 'DBMS tutorial with examples'
            }
        ]
    },
    'applied mathematics': {
        type: 'mathematics',
        resources: [
            {
                title: 'Applied Mathematics',
                source: 'Khan Academy',
                link: 'https://www.khanacademy.org/math',
                description: 'Mathematics applications in real world'
            },
            {
                title: 'Engineering Mathematics',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/engineering_mathematics/index.htm',
                description: 'Mathematics for engineering applications'
            }
        ]
    },

    // SEMESTER 4 - IT
    'core java': {
        type: 'programming',
        resources: [
            {
                title: 'Java Programming Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/java-tutorial',
                description: 'Complete Java tutorial for beginners'
            },
            {
                title: 'Learn Java Programming',
                source: 'Programiz',
                link: 'https://www.programiz.com/java-programming',
                description: 'Java programming with examples'
            }
        ]
    },
    'introduction to embedded systems': {
        type: 'theory',
        resources: [
            {
                title: 'Embedded Systems Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/embedded_systems/index.htm',
                description: 'Embedded systems concepts and design'
            },
            {
                title: 'Embedded Systems',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/introduction-of-embedded-systems-set-1/',
                description: 'Introduction to embedded systems'
            }
        ]
    },
    'computer-oriented statistical techniques': {
        type: 'mathematics',
        resources: [
            {
                title: 'Statistical Computing',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/r/index.htm',
                description: 'Statistical computing with R'
            },
            {
                title: 'Statistics with Python',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/statistics-with-python/',
                description: 'Statistical techniques using Python'
            }
        ]
    },
    'software engineering': {
        type: 'theory',
        resources: [
            {
                title: 'Software Engineering Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/software_engineering/index.htm',
                description: 'Software development lifecycle and methodologies'
            },
            {
                title: 'Software Engineering',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/software-engineering/',
                description: 'SE concepts and best practices'
            }
        ]
    },
    'computer graphics and animation': {
        type: 'programming',
        resources: [
            {
                title: 'Computer Graphics Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/computer_graphics/index.htm',
                description: 'Computer graphics concepts and algorithms'
            },
            {
                title: 'Animation Principles',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/basic-principles-of-animation/',
                description: 'Animation techniques and principles'
            }
        ]
    },

    // SEMESTER 5 - IT
    'internet of things': {
        type: 'theory',
        resources: [
            {
                title: 'IoT Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/iot-tutorial',
                description: 'Internet of Things concepts and applications'
            },
            {
                title: 'IoT Fundamentals',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/introduction-to-internet-of-things-iot-set-1/',
                description: 'IoT basics and architecture'
            }
        ]
    },
    'software project management': {
        type: 'theory',
        resources: [
            {
                title: 'Project Management Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/software_engineering/software_project_management.htm',
                description: 'Software project management principles'
            },
            {
                title: 'Agile Methodology',
                source: 'Atlassian',
                link: 'https://www.atlassian.com/agile',
                description: 'Agile project management guide'
            }
        ]
    },
    'artificial intelligence': {
        type: 'theory',
        resources: [
            {
                title: 'AI Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/artificial-intelligence-tutorial',
                description: 'Artificial intelligence concepts and algorithms'
            },
            {
                title: 'Artificial Intelligence',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/artificial-intelligence/',
                description: 'AI and machine learning tutorials'
            }
        ]
    },
    'enterprise java': {
        type: 'programming',
        resources: [
            {
                title: 'Enterprise Java Tutorial',
                source: 'JavaTpoint',
                link: 'https://www.javatpoint.com/j2ee-tutorial',
                description: 'J2EE and enterprise Java development'
            },
            {
                title: 'Java EE Tutorial',
                source: 'Oracle',
                link: 'https://docs.oracle.com/javaee/7/tutorial/',
                description: 'Official Java Enterprise Edition tutorial'
            }
        ]
    },
    'advanced web programming': {
        type: 'programming',
        resources: [
            {
                title: 'Advanced Web Development',
                source: 'MDN Web Docs',
                link: 'https://developer.mozilla.org/en-US/docs/Web/Guide',
                description: 'Advanced web development techniques'
            },
            {
                title: 'Full Stack Development',
                source: 'FreeCodeCamp',
                link: 'https://www.freecodecamp.org/learn/',
                description: 'Comprehensive web development curriculum'
            }
        ]
    },

    // SEMESTER 6 - IT
    'business intelligence': {
        type: 'theory',
        resources: [
            {
                title: 'Business Intelligence Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/business_intelligence/index.htm',
                description: 'BI concepts and tools'
            },
            {
                title: 'Introduction to BI',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/business-intelligence/',
                description: 'Business intelligence fundamentals'
            }
        ]
    },
    'it service management': {
        type: 'theory',
        resources: [
            {
                title: 'ITIL Framework',
                source: 'AXELOS',
                link: 'https://www.axelos.com/best-practice-solutions/itil',
                description: 'IT service management best practices'
            },
            {
                title: 'ITSM Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/it_service_management/index.htm',
                description: 'IT service management concepts'
            }
        ]
    },
    'principles of gis': {
        type: 'theory',
        resources: [
            {
                title: 'GIS Tutorial',
                source: 'QGIS',
                link: 'https://www.qgis.org/en/docs/index.html',
                description: 'Geographic Information Systems tutorial'
            },
            {
                title: 'Introduction to GIS',
                source: 'Coursera',
                link: 'https://www.coursera.org/learn/gis',
                description: 'GIS fundamentals course'
            }
        ]
    },
    'software quality assurance': {
        type: 'theory',
        resources: [
            {
                title: 'Software QA Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/software_testing_dictionary/software_quality_assurance.htm',
                description: 'Software quality assurance principles'
            },
            {
                title: 'SQA Guide',
                source: 'Guru99',
                link: 'https://www.guru99.com/software-quality-assurance.html',
                description: 'Software QA processes and techniques'
            }
        ]
    },
    'security in computing': {
        type: 'theory',
        resources: [
            {
                title: 'Computer Security Tutorial',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/computer_security/index.htm',
                description: 'Computer security concepts'
            },
            {
                title: 'Cybersecurity Fundamentals',
                source: 'Cisco',
                link: 'https://www.cisco.com/c/en/us/products/security/cybersecurity.html',
                description: 'Cybersecurity principles and practices'
            }
        ]
    },

    // DEFAULT FALLBACK
    'default': {
        type: 'general',
        resources: [
            {
                title: 'Computer Science Resources',
                source: 'GeeksforGeeks',
                link: 'https://www.geeksforgeeks.org/',
                description: 'Comprehensive CS tutorials and notes'
            },
            {
                title: 'Programming Tutorials',
                source: 'TutorialsPoint',
                link: 'https://www.tutorialspoint.com/index.htm',
                description: 'All programming language tutorials'
            }
        ]
    }
};

/**
 * GET /api/notes?subjectId=&search=
 * Fetch structured notes for BSc CS/IT subjects
 */
router.get('/', async (req, res) => {
    try {
        const { subjectId, search } = req.query;

        if (!subjectId) return res.status(400).json({ error: 'subjectId is required' });

        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        const subjectName = subject.name.toLowerCase();
        let notes = [];

        // Get resources for the specific subject
        const subjectResources = SUBJECT_TO_RESOURCES[subjectName] || SUBJECT_TO_RESOURCES.default;

        // Create structured notes from the resources
        subjectResources.resources.forEach((resource, index) => {
            notes.push({
                _id: `${subjectId}-${resource.source.toLowerCase()}-${index}`,
                title: resource.title,
                uploader: resource.source,
                date: new Date().toISOString().split('T')[0],
                topic: subject.name,
                description: resource.description,
                type: getNoteType(subjectResources.type),
                link: resource.link,
                source: resource.source.toLowerCase(),
                rating: 5,
                organized: true,
                subject: subject.name,
                semester: getSemester(subject.name)
            });
        });

        // Add additional subject-specific resources
        addAdditionalResources(subject.name, notes, subjectId);

        // Use Fuse.js for fuzzy search if search term is provided
        if (search) {
            const fuseOptions = {
                keys: ['title', 'description', 'topic'],
                threshold: 0.4, // Adjust for more/less strict matching
                ignoreLocation: true
            };
            const fuse = new Fuse(notes, fuseOptions);
            notes = fuse.search(search).map(result => result.item);
        }

        res.json({ 
            success: true, 
            notes: notes,
            count: notes.length,
            subject: subject.name,
            semester: getSemester(subject.name),
            message: `Structured notes for ${subject.name}`
        });

    } catch (err) {
        console.error('Error fetching structured notes:', err.message);
        res.status(500).json({ error: 'Failed to load structured notes' });
    }
});

// Helper functions
function getNoteType(resourceType) {
    const typeMap = {
        'programming': 'Programming Tutorial',
        'theory': 'Theory Notes',
        'mathematics': 'Mathematics Resources',
        'operating system': 'OS Tutorial',
        'general': 'Learning Resources'
    };
    return typeMap[resourceType] || 'Study Material';
}

function getSemester(subjectName) {
    const subjectLower = subjectName.toLowerCase();
    const semesterMap = {
        // BSc CS - Semester 1
        'computer organization and design': 'Semester 1',
        'programming with python i': 'Semester 1',
        'free and open-source software': 'Semester 1',
        'database system': 'Semester 1',
        'discrete mathematics': 'Semester 1',
        'descriptive statistics & introduction': 'Semester 1',
        'soft skills development': 'Semester 1',
        
        // BSc CS - Semester 2
        'programming with c': 'Semester 2',
        'green technologies': 'Semester 2',
        'data structures': 'Semester 2',
        'calculus': 'Semester 2',
        'programming with python ii': 'Semester 2',
        'statistical methods and testing of hypothesis': 'Semester 2',
        'linux': 'Semester 2',
        
        // BSc CS - Semester 3
        'operating system': 'Semester 3',
        'combinatorics and graph theory': 'Semester 3',
        'web programming': 'Semester 3',
        'database management systems': 'Semester 3',
        'core java': 'Semester 3',
        'theory of computation': 'Semester 3',
        'physical computing and iot programming': 'Semester 3',
        
        // BSc CS - Semester 4
        'computer networks': 'Semester 4',
        'linear algebra using python': 'Semester 4',
        'android developer fundamentals': 'Semester 4',
        'advanced java': 'Semester 4',
        '.net technology': 'Semester 4',
        'fundamentals of algorithms': 'Semester 4',
        'software engineering': 'Semester 4',
        
        // BSc CS - Semester 5
        'software testing & quality assurance': 'Semester 5',
        'web services': 'Semester 5',
        'artificial intelligence': 'Semester 5',
        'information & network security': 'Semester 5',
        'linux server administration': 'Semester 5',
        'architecture of iot': 'Semester 5',
        'game programming': 'Semester 5',
        
        // BSc CS - Semester 6
        'wireless sensor networks & mobile communication': 'Semester 6',
        'information retrieval': 'Semester 6',
        'ethical hacking': 'Semester 6',
        'digital image processing': 'Semester 6',
        'data science': 'Semester 6',
        'cloud computing': 'Semester 6',
        
        // BSc IT - Semester 1
        'imperative programming': 'Semester 1',
        'digital electronics': 'Semester 1',
        'operating systems': 'Semester 1',
        'communication skills': 'Semester 1',
        
        // BSc IT - Semester 2
        'object-oriented programming': 'Semester 2',
        'microprocessor architecture': 'Semester 2',
        'web programming': 'Semester 2',
        'numerical and statistical methods': 'Semester 2',
        'green computing': 'Semester 2',
        
        // BSc IT - Semester 3
        'python programming': 'Semester 3',
        'data structures': 'Semester 3',
        'computer networks': 'Semester 3',
        'database management systems': 'Semester 3',
        'applied mathematics': 'Semester 3',
        
        // BSc IT - Semester 4
        'core java': 'Semester 4',
        'introduction to embedded systems': 'Semester 4',
        'computer-oriented statistical techniques': 'Semester 4',
        'software engineering': 'Semester 4',
        'computer graphics and animation': 'Semester 4',
        
        // BSc IT - Semester 5
        'internet of things': 'Semester 5',
        'software project management': 'Semester 5',
        'artificial intelligence': 'Semester 5',
        'enterprise java': 'Semester 5',
        'advanced web programming': 'Semester 5',
        
        // BSc IT - Semester 6
        'business intelligence': 'Semester 6',
        'it service management': 'Semester 6',
        'principles of gis': 'Semester 6',
        'software quality assurance': 'Semester 6',
        'security in computing': 'Semester 6'
    };
    
    return semesterMap[subjectLower] || 'BSc CS/IT';
}

function addAdditionalResources(subjectName, notes, subjectId) {
    const additionalResources = {
        'discrete mathematics': [
            {
                title: 'Discrete Mathematics Lecture Notes',
                source: 'University of Colorado',
                link: 'https://www.colorado.edu/amath/sites/default/files/attached-files/discrete_math.pdf',
                description: 'PDF notes on discrete mathematics'
            }
        ],
        'data structures': [
            {
                title: 'Visualgo Data Structures',
                source: 'Visualgo',
                link: 'https://visualgo.net/en',
                description: 'Visualization of data structures and algorithms'
            }
        ],
        'algorithm': [
            {
                title: 'Big-O Algorithm Complexity',
                source: 'Big-O Cheat Sheet',
                link: 'https://www.bigocheatsheet.com/',
                description: 'Algorithm complexity reference'
            }
        ]
    };

    const extraResources = additionalResources[subjectName.toLowerCase()];
    if (extraResources) {
        extraResources.forEach((resource, index) => {
            notes.push({
                _id: `${subjectId}-extra-${index}`,
                title: resource.title,
                uploader: resource.source,
                date: new Date().toISOString().split('T')[0],
                topic: subjectName,
                description: resource.description,
                type: 'Additional Resources',
                link: resource.link,
                source: 'additional',
                rating: 4,
                organized: true
            });
        });
    }
}

/**
 * GET /api/notes/:id
 * Fetch specific note content
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [subjectId, source, index] = id.split('-');
        
        if (!subjectId || !source) {
            return res.status(400).json({ error: 'Invalid note ID format' });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        // Return structured content
        const noteContent = {
            title: `${subject.name} - Study Materials`,
            content: getStructuredContent(subject.name),
            subjectName: subject.name,
            source: source,
            semester: getSemester(subject.name),
            chapters: getChaptersForSubject(subject.name),
            resources: getAdditionalResources(subject.name),
            downloadLinks: getDownloadableResources(subject.name)
        };

        res.json({
            success: true,
            note: noteContent
        });

    } catch (err) {
        console.error('Error fetching note content:', err.message);
        res.status(500).json({ error: 'Failed to load note content' });
    }
});

function getStructuredContent(subjectName) {
    return `# ${subjectName} - Complete Study Guide

## Course Description
This guide provides comprehensive study materials for ${subjectName} as per BSc CS/IT curriculum.

## Learning Objectives
- Understand fundamental concepts
- Master practical implementations
- Prepare for examinations
- Develop problem-solving skills

## Assessment
- Theory examinations
- Practical assignments
- Project work
- Viva voce`;
}

function getChaptersForSubject(subjectName) {
    // Return structured chapters based on subject
    const chapters = {
        'discrete mathematics': [
            'Sets and Relations',
            'Functions and Logic',
            'Combinatorics',
            'Graph Theory',
            'Boolean Algebra'
        ],
        'data structures': [
            'Arrays and Linked Lists',
            'Stacks and Queues',
            'Trees and Binary Search Trees',
            'Graphs',
            'Sorting Algorithms',
            'Searching Algorithms'
        ],
        'database system': [
            'ER Model',
            'Relational Algebra',
            'SQL Programming',
            'Normalization',
            'Transaction Management'
        ]
    };

    return chapters[subjectName.toLowerCase()] || [
        'Introduction',
        'Basic Concepts',
        'Advanced Topics',
        'Applications',
        'Case Studies'
    ];
}

function getAdditionalResources(subjectName) {
    return {
        'video_lectures': `https://www.youtube.com/results?search_query=${encodeURIComponent(subjectName + ' bsc cs it')}`,
        'practice_questions': `https://www.geeksforgeeks.org/tag/${subjectName.toLowerCase().replace(/\s+/g, '-')}/`,
        'reference_books': `https://www.amazon.com/s?k=${encodeURIComponent(subjectName + ' textbook')}`,
        'previous_papers': `https://www.google.com/search?q=${encodeURIComponent(subjectName + ' previous year question papers')}`
    };
}

function getDownloadableResources(subjectName) {
    return {
        'pdf_notes': `https://www.google.com/search?q=${encodeURIComponent(subjectName + ' notes pdf')}`,
        'slide_decks': `https://www.google.com/search?q=${encodeURIComponent(subjectName + ' powerpoint slides')}`,
        'lab_manuals': `https://www.google.com/search?q=${encodeURIComponent(subjectName + ' lab manual')}`,
        'formula_sheets': `https://www.google.com/search?q=${encodeURIComponent(subjectName + ' formula sheet')}`
    };
}

export default router;