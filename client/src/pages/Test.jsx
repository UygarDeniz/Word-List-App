import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import questions from "./testData.js";
import "../styles/style.css";
import Button from "../components/Button";

function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerClass, setAnswerClass] = useState(null);
  const [score, setScore] = useState({true: 0, false: 0});
  const [gameEnd, setGameEnd] = useState(false);


  function handleClick(answer) {
    const isEnd = currentQuestion < questions.length - 1;
    setAnswerClass(answer.correct ? "answer true" : "answer false");
    setSelectedAnswer(answer);


    setTimeout(() => {
      setSelectedAnswer(null);
      answer && setScore(prev => {
        return answer.correct ? 
        {...prev, true: prev.true + 1} :
        {...prev, false: prev.false + 1}
    
      });
      
      if(isEnd) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setGameEnd(true);
      }
      
    }, 1000);


  }

  function handlePlayAgain() {
    setGameEnd(false);
    setCurrentQuestion(0);
    setScore({true: 0, false: 0});
  }

  return (
    <div className="container">
      <Header />
      <main className="questions-container">
        <div className="questions">
          {!gameEnd && <h1 className="question">{questions[currentQuestion].question}</h1>}
          {
            <h2 className="score ">
              Score: {score.true} / {score.true + score.false}
            </h2>
          }
          {!gameEnd ?
          <div className="answers">
            {questions[currentQuestion].answers.map((answer, index) => (
              <div
                key={index}
                className={
                  selectedAnswer?.text === answer.text ? answerClass : "answer"
                }
                onClick={() => handleClick(answer)}
              >
                {answer.text}
              </div>
            ))}
          </div>
          : <div className="game-end"> 
                <h1>Game Ended</h1>
                <Button text="Play Again" onClick={handlePlayAgain}/>
          </div>}
        </div>
      </main>
    </div>
  );
}

export default Test;
