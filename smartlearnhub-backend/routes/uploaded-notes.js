/* eslint-disable no-undef */

router.get('/uploaded-notes', async (req, res) => {
    try {
        const { subjectId } = req.query;

        if (!subjectId) {
            return res.status(400).json({ error: 'subjectId is required' });
        }

        
        const uploadedNotes = await Note.find({ subject: subjectId })
            .populate('user', 'name')
            .populate('subject', 'name')
            .sort({ createdAt: -1 });

      
        const formattedNotes = uploadedNotes.map(note => ({
            _id: note._id,
            title: note.title,
            uploader: note.user.name,
            date: note.createdAt.toISOString().split('T')[0],
            topic: note.subject.name,
            description: note.content,
            type: 'Uploaded Note',
            link: `/api/notes/view/${note._id}`,
            source: 'peer',
            rating: 4,
            organized: true,
            subject: note.subject.name,
            // eslint-disable-next-line no-undef
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