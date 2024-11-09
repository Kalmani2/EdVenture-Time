import React, { useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import '../css/AssetQuiz.css'; // Import the CSS file

export default function AssetQuiz({
  filePath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  jsonFile,
  name,
}) {
  const ref = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, filePath);

  // Open the popup and load the quiz data when clicked
  const handleClick = () => {
    if (jsonFile && jsonFile[name]) {
      setQuizData(jsonFile[name]);
      setIsPopupVisible(true);
    }
  };

  const handleAnswerSelection = (isCorrect) => {
    setSelectedAnswer(isCorrect);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsPopupVisible(false); // Close the popup after the last question
    }
  };

  const currentMultipleChoice = quizData?.multiple_choice?.[currentQuestionIndex];
  const currentOpenQuestion = quizData?.questions?.[currentQuestionIndex];

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      <primitive object={gltf.scene} scale={scale} />
      {isPopupVisible && quizData && (
        <Html position={[0, 3, 0]} center>
          <div className="assetquiz-popup">
            {/* Title */}
            <div className="assetquiz-title">{name} Quiz</div>

            {/* Display multiple-choice question */}
            {currentMultipleChoice && (
              <div className="assetquiz-question">
                <p>{currentMultipleChoice.question}</p>
                {currentMultipleChoice.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(option.correct)}
                    disabled={showAnswer} // Disable after selection
                    className={`assetquiz-option ${showAnswer && option.correct ? 'correct' : ''} ${
                      showAnswer && !option.correct && option.answer === selectedAnswer ? 'incorrect' : ''
                    }`}
                  >
                    {option.answer}
                  </button>
                ))}
                {showAnswer && (
                  <p className="assetquiz-answer-feedback">
                    {selectedAnswer ? "Correct!" : "Incorrect. Try the next question!"}
                  </p>
                )}
              </div>
            )}

            {/* Display open-ended question */}
            {!currentMultipleChoice && currentOpenQuestion && (
              <div className="assetquiz-question">
                <p>{currentOpenQuestion.question}</p>
                {showAnswer ? (
                  <p className="assetquiz-answer-reveal">{currentOpenQuestion.answer}</p>
                ) : (
                  <button onClick={() => setShowAnswer(true)} className="assetquiz-reveal-button">
                    Reveal Answer
                  </button>
                )}
              </div>
            )}

            {/* Display random fact if no more questions */}
            {!currentMultipleChoice && !currentOpenQuestion && quizData.random_fact && (
              <p className="assetquiz-random-fact">Did you know? {quizData.random_fact}</p>
            )}

            {/* Navigation Button */}
            <button onClick={handleNextQuestion} className="assetquiz-next-button">
              {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>

            {/* Close Button */}
            <button className="assetquiz-close-button" onClick={() => setIsPopupVisible(false)}>
              ×
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
