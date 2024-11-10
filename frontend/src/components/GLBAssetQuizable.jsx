import React, { useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import '../css/AssetQuiz.css'; // Import the CSS file

// Sample JSON data for demonstration
const data = {
  "architecture": {
    "multiple_choice": [
      {
        "options": [
          { "answer": "Massive round columns", "correct": false },
          { "answer": "Flat roofs", "correct": false },
          { "answer": "Pointed arches", "correct": true }
        ],
        "question": "What is a distinctive feature of Gothic architecture?"
      }
    ],
    "questions": [
      {
        "answer": "The Gothic style was the predominant architectural style of the Middle Ages.",
        "question": "What was the predominant architectural style of the Middle Ages?"
      },
      {
        "answer": "The most significant and common building in Medieval architecture was the Christian church, serving both religious and community functions.",
        "question": "What was the most significant type of building in Medieval architecture?"
      }
    ],
    "random_fact": "Most domestic buildings in the Middle Ages were constructed with timber and wattle and daub. Only the wealthy could afford to build and maintain stone buildings."
  }
};

export default function GLBAssetQuizable({
  filePath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  message,
  name,
  interactable,
}) {
  const ref = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [quizMode, setQuizMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('architecture');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // Track the current question for quiz mode
  const [selectedAnswer, setSelectedAnswer] = useState(null);  // Track selected answer
  const [questionAnswer, setQuestionAnswer] = useState(''); // Display the answer to the question selected from buttons

  const gltf = useLoader(GLTFLoader, filePath);
  const categoryData = data[currentCategory];
  const questionData = categoryData.questions;
  const multipleChoiceData = categoryData.multiple_choice;
  
  const funFact = categoryData.random_fact;


  // Handle popup toggle
  const handleClick = () => {
    if (!isPopupVisible && message) {
      setIsPopupVisible(true);
    }
  };

  // Show the answer to the selected question from button 1 or 2
  const handleQuestionClick = (index) => {
    const selectedQuestion = questionData[index];
    // Display both the question and the corresponding answer
    setCurrentMessage(
      `${selectedQuestion.question} - ${selectedQuestion.answer}`
    );
  };

  // Start quiz mode
  const handleQuizClick = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCurrentMessage(multipleChoiceData[0].question);
  };

  // Handle multiple choice answer selection
  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    const isCorrect = option.correct;
    setCurrentMessage(isCorrect ? 'Correct!' : 'Incorrect. Try again!');
  };

  // Show next question in quiz mode
  const handleNextQuestion = () => {
    if (currentQuestionIndex < multipleChoiceData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setCurrentMessage(multipleChoiceData[currentQuestionIndex + 1].question);
    } else {
      setQuizMode(false);
      setCurrentMessage("You've completed the quiz!");
    }
  };

  const popupHeightClass = interactable ? 'large-popup' : 'small-popup';

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      <primitive object={gltf.scene} scale={scale} />
      {isPopupVisible && currentMessage && (
        <Html position={[0, 3, 0]} center>
          <div className={`popup-container ${popupHeightClass}`}>
            {/* Title Section */}
            <div className="popup-title">{name}</div>

            {/* Message Section (either fun fact or selected question answer) */}
            <p className="popup-message">{currentMessage}</p>

            {/* Show Fun Fact and Question Buttons */}
            {!quizMode && (
              <>
                {/* Only show fun fact before quiz mode starts */}
                <p className="popup-fun-fact">{funFact}</p>
                
                {/* Buttons to select questions */}
                <div className="popup-actions">
                  <button
                    className="popup-extra-button"
                    onClick={() => handleQuestionClick(0)} // Show answer for first question
                  >
                    {questionData[0].question}
                  </button>
                  <button
                    className="popup-extra-button"
                    onClick={() => handleQuestionClick(1)} // Show answer for second question
                  >
                    {questionData[1].question}
                  </button>
                  <button
                    className="popup-extra-button"
                    onClick={handleQuizClick} // Start quiz mode
                  >
                    Start Quiz
                  </button>
                </div>
              </>
            )}

            {/* Show Quiz Options (after clicking "Start Quiz") */}
            {quizMode && multipleChoiceData.length > 0 && (
              <div className="popup-actions">
                <p className="popup-question">
                  {multipleChoiceData[currentQuestionIndex].question}
                </p>
                {multipleChoiceData[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className="popup-extra-button"
                    onClick={() => handleAnswerClick(option)}
                  >
                    {option.answer}
                  </button>
                ))}
              </div>
            )}

            {/* Next Button for Quiz */}
            {quizMode && selectedAnswer && (
              <button className="popup-extra-button" onClick={handleNextQuestion}>
                Next Question
              </button>
            )}

            {/* Close Button */}
            <button className="close-button" onClick={() => setIsPopupVisible(false)}>
              ×
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
