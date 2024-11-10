import React, { useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Html } from '@react-three/drei';
import '../css/AssetQuiz.css'; // Import the CSS file

export default function AssetQuiz({
  filePath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  name,
}) {
  const ref = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentQuizData, setCurrentQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, filePath);

  // Open the popup and load the quiz data when clicked
  const handleClick = () => {
    if (quizData && quizData[name]) {
      setCurrentQuizData(quizData[name]);
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
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const currentMultipleChoice = currentQuizData?.multiple_choice?.[currentQuestionIndex];
  const currentOpenQuestion = currentQuizData?.questions?.[currentQuestionIndex];

  // Determine if there are more questions
  const hasMoreMultipleChoice = currentQuizData?.multiple_choice && currentQuestionIndex < currentQuizData.multiple_choice.length;
  const hasMoreOpenQuestions = currentQuizData?.questions && currentQuestionIndex < currentQuizData.questions.length;

  return (
    <group ref={ref} position={position} onClick={handleClick}>
      <primitive object={gltf.scene} scale={scale} />
      {isPopupVisible && currentQuizData && (
        <Html position={[0, 3, 0]} center>
          <div className="assetquiz-popup">
            {/* Title */}
            <div className="assetquiz-title">{name} Quiz</div>

            {/* Display multiple-choice question */}
            {hasMoreMultipleChoice && (
              <div className="assetquiz-question">
                <p>{currentMultipleChoice.question}</p>
                {currentMultipleChoice.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(option.correct)}
                    disabled={showAnswer} // Disable after selection
                    className={`assetquiz-option ${
                      showAnswer && option.correct ? 'correct' : ''
                    } ${
                      showAnswer && !option.correct && option.answer === selectedAnswer
                        ? 'incorrect'
                        : ''
                    }`}
                  >
                    {option.answer}
                  </button>
                ))}
                {showAnswer && (
                  <p className="assetquiz-answer-feedback">
                    {selectedAnswer ? 'Correct!' : 'Incorrect. Try the next question!'}
                  </p>
                )}
              </div>
            )}

            {/* Display open-ended question */}
            {!hasMoreMultipleChoice && hasMoreOpenQuestions && (
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
            {!hasMoreMultipleChoice && !hasMoreOpenQuestions && currentQuizData.random_fact && (
              <p className="assetquiz-random-fact">Did you know? {currentQuizData.random_fact}</p>
            )}

            {/* Navigation Button */}
            {(hasMoreMultipleChoice || hasMoreOpenQuestions) && (
              <button onClick={handleNextQuestion} className="assetquiz-next-button">
                Next Question
              </button>
            )}

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
