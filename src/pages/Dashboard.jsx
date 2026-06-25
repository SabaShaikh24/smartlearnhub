/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Memory Game Component
const MemoryGame = () => {
  const [cards, setCards] = useState([
    { id: 1, emoji: '🐱', flipped: false, matched: false },
    { id: 2, emoji: '🐶', flipped: false, matched: false },
    { id: 3, emoji: '🐵', flipped: false, matched: false },
    { id: 4, emoji: '🐰', flipped: false, matched: false },
    { id: 5, emoji: '🐱', flipped: false, matched: false },
    { id: 6, emoji: '🐶', flipped: false, matched: false },
    { id: 7, emoji: '🐵', flipped: false, matched: false },
    { id: 8, emoji: '🐰', flipped: false, matched: false },
  ].sort(() => Math.random() - 0.5));

  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].flipped = false;
          resetCards[secondIndex].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(cards.map(card => ({ ...card, flipped: false, matched: false })).sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Memory Game 🧠</h3>
      <p className="mb-4">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 text-2xl rounded-lg transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-pink-200 transform scale-105'
                : 'bg-white hover:bg-pink-100'
            } ${card.matched ? 'ring-2 ring-pink-500' : ''}`}
            disabled={card.matched}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
      >
        New Game
      </button>
    </div>
  );
};

// Number Guessing Game Component
const NumberGuessingGame = () => {
  const [number, setNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Guess a number between 1-100');
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const userGuess = parseInt(guess);
    setAttempts(attempts + 1);

    if (userGuess === number) {
      setMessage(`🎉 Correct! You guessed it in ${attempts + 1} attempts!`);
    } else if (userGuess < number) {
      setMessage('📈 Too low! Try again.');
    } else {
      setMessage('📉 Too high! Try again.');
    }
    setGuess('');
  };

  const resetGame = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Guess a number between 1-100');
    setAttempts(0);
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Number Guessing Game 🔢</h3>
      <p className="mb-2">{message}</p>
      <p className="mb-4">Attempts: {attempts}</p>
      <input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="w-32 px-3 py-2 border rounded-lg mb-2"
        min="1"
        max="100"
      />
      <div className="space-x-2">
        <button
          onClick={handleGuess}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Guess
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

// Quick Math Game Component
const QuickMathGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [gameActive, setGameActive] = useState(false);

  function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let solution;
    switch (operator) {
      case '+': solution = num1 + num2; break;
      case '-': solution = num1 - num2; break;
      case '*': solution = num1 * num2; break;
      default: solution = num1 + num2;
    }

    return { num1, num2, operator, solution };
  }

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setProblem(generateProblem());
    setAnswer('');
    setGameActive(true);

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };

  const checkAnswer = () => {
    if (parseInt(answer) === problem.solution) {
      setScore(score + 1);
      setProblem(generateProblem());
    }
    setAnswer('');
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Quick Math Challenge ➕➖✖️</h3>
      {!gameActive ? (
        <button
          onClick={startGame}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-lg"
        >
          Start Game
        </button>
      ) : (
        <>
          <p className="text-2xl font-bold mb-2">
            {problem.num1} {problem.operator} {problem.num2} = ?
          </p>
          <p className="mb-2">Score: {score} | Time: {timeLeft}s</p>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            className="w-32 px-3 py-2 border rounded-lg mb-2 text-center text-xl"
            autoFocus
          />
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 ml-2"
          >
            Check
          </button>
        </>
      )}
    </div>
  );
};

// Break Activity Components
const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [timer, setTimer] = useState(4);
  const intervalRef = useRef(null);
  const phaseRef = useRef('inhale');

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setTimer(4);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // Move to next phase
          if (phaseRef.current === 'inhale') {
            setPhase('hold');
            phaseRef.current = 'hold';
            return 7;
          } else if (phaseRef.current === 'hold') {
            setPhase('exhale');
            phaseRef.current = 'exhale';
            return 8;
          } else {
            setPhase('inhale');
            phaseRef.current = 'inhale';
            return 4;
          }
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Stop after 2 minutes
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsActive(false);
      setPhase('inhale');
      phaseRef.current = 'inhale';
      setTimer(4);
    }, 120000);
  };

  const stopExercise = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setTimer(4);
  };

  return (
    <div className="text-center p-4">
      <h3 className="text-xl font-semibold mb-4">Breathing Exercise 🌬️</h3>
      <p className="mb-2">4-7-8 Technique: Inhale (4s), Hold (7s), Exhale (8s)</p>
      
      <div className="relative w-48 h-48 mx-auto mb-4">
        <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-1000 ${
          phase === 'inhale' ? 'bg-pink-200 scale-110' : 
          phase === 'hold' ? 'bg-pink-100 scale-100' : 
          'bg-pink-50 scale-90'
        }`}>
          <span className="text-4xl font-bold">{timer}</span>
        </div>
      </div>
      
      <p className="text-lg font-medium mb-2 capitalize">{phase}...</p>
      
      {!isActive ? (
        <button
          onClick={startExercise}
          className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Start Breathing Exercise
        </button>
      ) : (
        <button
          onClick={stopExercise}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Stop
        </button>
      )}
    </div>
  );
};

const StretchReminder = () => {
  const [timeUntilStretch, setTimeUntilStretch] = useState(20 * 60); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  // eslint-disable-next-line no-undef
  useEffect(() => {
    let interval;
    if (isActive && timeUntilStretch > 0) {
      interval = setInterval(() => {
        setTimeUntilStretch((time) => time - 1);
      }, 1000);
    } else if (timeUntilStretch === 0) {
      // Play notification sound (if you want to add later)
      alert("Time to stretch! 💪");
    }
    return () => clearInterval(interval);
  }, [isActive, timeUntilStretch]);

  const startTimer = () => {
    setIsActive(true);
    setTimeUntilStretch(20 * 60); // 20 minutes
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTimeUntilStretch(20 * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center p-4">
      <h3 className="text-xl font-semibold mb-4">Stretch Reminder 💪</h3>
      <p className="mb-4">Take a break every 20 minutes to stretch</p>
      
      <div className="text-3xl font-bold mb-4">
        {formatTime(timeUntilStretch)}
      </div>
      
      <div className="space-x-2">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Start Timer
          </button>
        ) : (
          <button
            onClick={stopTimer}
            className="px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
      
      {timeUntilStretch === 0 && (
        <div className="mt-4 p-3 bg-pink-100 rounded-lg">
          <p className="font-semibold">Time to stretch!</p>
          <p className="text-sm">Try these: Neck rolls, Shoulder shrugs, Wrist stretches</p>
        </div>
      )}
    </div>
  );
};

const QuickMeditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [showGuidance, setShowGuidance] = useState(true);

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startMeditation = () => {
    setIsActive(true);
    setTimeLeft(5 * 60);
  };

  const stopMeditation = () => {
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center p-4">
      <h3 className="text-xl font-semibold mb-4">Quick Meditation 🧘</h3>
      
      {!isActive ? (
        <div>
          <p className="mb-4">Take 5 minutes to clear your mind</p>
          <button
            onClick={startMeditation}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-lg"
          >
            Start 5-Minute Meditation
          </button>
        </div>
      ) : (
        <div>
          <div className="text-4xl font-bold mb-4">
            {formatTime(timeLeft)}
          </div>
          
          {showGuidance && (
            <div className="mb-4 p-3 bg-pink-50 rounded-lg">
              <p className="font-medium">Focus on your breath</p>
              <p className="text-sm">Inhale slowly... Exhale slowly...</p>
            </div>
          )}
          
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mb-2"
          >
            {showGuidance ? 'Hide Guidance' : 'Show Guidance'}
          </button>
          
          <button
            onClick={stopMeditation}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ml-2"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

// User Greeting Component
const UserGreeting = ({ userName }) => {
  const [timeOfDay, setTimeOfDay] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const hours = now.getHours();
      if (hours < 12) setTimeOfDay('Morning');
      else if (hours < 17) setTimeOfDay('Afternoon');
      else setTimeOfDay('Evening');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-pink-800">
        Good {timeOfDay}{userName ? `, ${userName}` : ''}! ☀️
      </h2>
      <p className="text-pink-600">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

// Motivation Quote Component
const DailyMotivation = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });

  const motivationalQuotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      text: "Everything you've ever wanted is on the other side of fear.",
      author: "George Addair"
    },
    {
      text: "Productivity is never an accident. It is always the result of a commitment to excellence.",
      author: "Paul J. Meyer"
    }
  ];

  useEffect(() => {
    // Get a different quote each day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dailyQuote = motivationalQuotes[dayOfYear % motivationalQuotes.length];
    setQuote(dailyQuote);
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-4 rounded-lg text-center">
      <p className="text-lg italic">"{quote.text}"</p>
      <p className="text-sm text-pink-700 mt-2">- {quote.author}</p>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [userName, setUserName] = useState('');

  // For demo purposes, let's set a default name
  useEffect(() => {
    // In a real app, you would get this from your authentication context
    setUserName('User');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20} }
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-pink-800 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-pink-600">Take a break and enjoy some fun games!</p>
        </motion.header>

        {/* Personalized Greeting */}
        <UserGreeting userName={userName} />

        {/* Daily Motivation */}
        <div className="mb-6">
          <DailyMotivation />
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 gap-4">
          {['welcome', 'games', 'break'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                activeTab === tab
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-pink-700 hover:bg-pink-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'welcome' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-pink-800">Welcome to Your Personal Space</h2>
              <p className="mb-4">
                Hello {userName}! This is your personalized dashboard where you can:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Play fun games to refresh your mind</li>
                <li>Take productive breaks with guided activities</li>
                <li>Stay motivated throughout the day</li>
              </ul>
              <p>What would you like to do today?</p>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-800">Simple Games</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <MemoryGame />
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <NumberGuessingGame />
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <QuickMathGame />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'break' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-800">Take a Break</h2>
              <p className="text-center text-pink-600 mb-6">
                Refresh your mind with these quick activities
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <BreathingExercise />
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <StretchReminder />
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <QuickMeditation />
                </div>
              </div>
              
              <div className="bg-pink-100 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-2">Break Tips</h3>
                <ul className="list-disc list-inside text-sm text-pink-700">
                  <li>Take regular breaks to maintain productivity</li>
                  <li>Look away from your screen every 20 minutes</li>
                  <li>Stay hydrated throughout the day</li>
                  <li>Stand up and move around periodically</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;