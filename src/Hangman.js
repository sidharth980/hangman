import React, { useState, useEffect, useCallback } from 'react';
import './index.css'; // Assuming you have a Tailwind CSS setup

// Tailwind CSS is assumed to be available globally

// --- Constants ---
const MAX_WORD_LENGTH = 8;
const MAX_MISTAKES = 6; // Head, Body, 2 Arms, 2 Legs
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// --- Helper Functions ---
const normalizeWord = (word) => {
  return word.toUpperCase().replace(/[^A-Z]/g, '');
};

// --- Components ---

// Component for Hangman Drawing (SVG based)
const HangmanDrawing = ({ numberOfMistakes }) => {
  const Head = (
    <circle cx="200" cy="90" r="30" stroke="black" strokeWidth="4" fill="none" key="head" />
  );
  const Body = (
    <line x1="200" y1="120" x2="200" y2="200" stroke="black" strokeWidth="4" key="body" />
  );
  const RightArm = (
    <line x1="200" y1="150" x2="250" y2="180" stroke="black" strokeWidth="4" key="rarm" />
  );
  const LeftArm = (
    <line x1="200" y1="150" x2="150" y2="180" stroke="black" strokeWidth="4" key="larm" />
  );
  const RightLeg = (
    <line x1="200" y1="200" x2="250" y2="250" stroke="black" strokeWidth="4" key="rleg" />
  );
  const LeftLeg = (
    <line x1="200" y1="200" x2="150" y2="250" stroke="black" strokeWidth="4" key="lleg" />
  );

  const bodyParts = [Head, Body, RightArm, LeftArm, RightLeg, LeftLeg];

  return (
    <div className="relative h-64 w-full max-w-xs mx-auto mb-4">
      <svg viewBox="0 0 300 350" className="w-full h-full">
        {/* Gallows */}
        <line x1="50" y1="330" x2="150" y2="330" stroke="black" strokeWidth="4" /> {/* Base */}
        <line x1="100" y1="330" x2="100" y2="50" stroke="black" strokeWidth="4" />  {/* Pole */}
        <line x1="100" y1="50" x2="200" y2="50" stroke="black" strokeWidth="4" />  {/* Beam */}
        <line x1="200" y1="50" x2="200" y2="60" stroke="black" strokeWidth="4" />  {/* Rope */}

        {/* Hangman Parts */}
        {bodyParts.slice(0, numberOfMistakes)}
      </svg>
    </div>
  );
};

// Component for Word Display (Blanks and Guessed Letters)
const WordDisplay = ({ word, guessedLetters }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mb-6 text-2xl md:text-3xl font-bold tracking-widest">
      {word.split('').map((letter, index) => (
        <span
          key={index}
          className="flex items-center justify-center border-b-4 border-gray-500 w-8 h-10 md:w-10 md:h-12" // Square-like appearance
        >
          {guessedLetters.includes(letter) ? letter : ''}
        </span>
      ))}
    </div>
  );
};

// Component for Virtual Keyboard
const Keyboard = ({ guessedLetters, correctLetters, incorrectLetters, onGuess, disabled }) => {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 gap-1 md:gap-2 max-w-xl mx-auto">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = correctLetters.includes(letter);
        const isIncorrect = incorrectLetters.includes(letter);
        let bgColor = 'bg-blue-500 hover:bg-blue-600'; // Default
        if (isCorrect) bgColor = 'bg-green-500';
        if (isIncorrect) bgColor = 'bg-red-500';
        if (isGuessed || disabled) bgColor += ' opacity-50 cursor-not-allowed';

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={isGuessed || disabled}
            className={`p-2 rounded text-white font-bold text-sm md:text-base transition-colors duration-200 ${bgColor}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

// Main App Component
function Hangman() {
  const [wordToGuess, setWordToGuess] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameState, setGameState] = useState('input'); // 'input', 'playing', 'won', 'lost'
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const correctLetters = guessedLetters.filter(letter => wordToGuess.includes(letter));
  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));

  // Check for Win/Loss conditions
  const isWinner = wordToGuess && wordToGuess.split('').every(letter => correctLetters.includes(letter));
  const isLoser = mistakes >= MAX_MISTAKES;

  useEffect(() => {
    if (isWinner) {
      setGameState('won');
    }
    if (isLoser) {
      setGameState('lost');
    }
  }, [isWinner, isLoser]);

  // Handle letter guess
  const handleGuess = useCallback((letter) => {
    if (gameState !== 'playing' || guessedLetters.includes(letter)) return;

    setGuessedLetters(prev => [...prev, letter]);

    if (!wordToGuess.includes(letter)) {
      setMistakes(prev => prev + 1);
    }
  }, [gameState, guessedLetters, wordToGuess]);


  // Handle word input submission
  const handleWordSubmit = (e) => {
    e.preventDefault();
    const normalized = normalizeWord(inputValue);
    if (!normalized) {
        setInputError('Please enter letters only.');
        return;
    }
    if (normalized.length > MAX_WORD_LENGTH) {
      setInputError(`Word cannot be longer than ${MAX_WORD_LENGTH} letters.`);
      return;
    }
     if (normalized.length === 0) {
      setInputError(`Word cannot be empty.`);
      return;
    }

    setWordToGuess(normalized);
    setGameState('playing');
    setInputValue(''); // Clear input field
    setInputError(''); // Clear error
    setGuessedLetters([]); // Reset guesses
    setMistakes(0); // Reset mistakes
  };

  // Reset game to input state
  const resetGame = () => {
    setWordToGuess('');
    setGuessedLetters([]);
    setMistakes(0);
    setGameState('input');
    setInputValue('');
    setInputError('');
  };

  // Render based on game state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Hangman Game</h1>

      {gameState === 'input' && (
        <form onSubmit={handleWordSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="wordInput" className="block text-gray-700 font-medium mb-2">
            Enter word to guess (max {MAX_WORD_LENGTH} letters):
          </label>
          <input
            id="wordInput"
            type="password" // Hide the word input
            value={inputValue}
            onChange={(e) => {
                setInputValue(e.target.value);
                setInputError(''); // Clear error on typing
            }}
            maxLength={MAX_WORD_LENGTH + 5} // Allow slightly more for potential non-letters before normalization
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Start Game
          </button>
        </form>
      )}

      {gameState !== 'input' && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Hangman Drawing */}
          <HangmanDrawing numberOfMistakes={mistakes} />

          {/* Win/Loss Message */}
          {gameState === 'won' && (
            <div className="text-center mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow">
              <p className="font-bold text-xl">You Won! 🎉</p>
              <p>The word was: <span className="font-semibold">{wordToGuess}</span></p>
              <button onClick={resetGame} className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md transition duration-200">
                Play Again?
              </button>
            </div>
          )}
          {gameState === 'lost' && (
            <div className="text-center mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow">
              <p className="font-bold text-xl">You Lost! 😢</p>
              <p>The word was: <span className="font-semibold">{wordToGuess}</span></p>
              <button onClick={resetGame} className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md transition duration-200">
                Play Again?
              </button>
            </div>
          )}

          {/* Word Display */}
          <WordDisplay word={wordToGuess} guessedLetters={correctLetters} />

          {/* Keyboard */}
          <Keyboard
             guessedLetters={guessedLetters}
             correctLetters={correctLetters}
             incorrectLetters={incorrectLetters}
             onGuess={handleGuess}
             disabled={gameState !== 'playing'}
          />

          {/* Reset Button during play */}
          {gameState === 'playing' && (
             <button onClick={resetGame} className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                Give Up / New Word
             </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Hangman;
