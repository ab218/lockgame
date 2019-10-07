import React, {useState} from 'react';
import './App.css';

function PreGameState({digits, setDigits, setMode, generateRandomNumber}) {
  function startGame() {
    setMode('PLAY');
    generateRandomNumber(digits);
  }
  function setCorrectDigits(value) {
    if (!value || value <= 0) {
      return setDigits(1);
    } else if (value >= 6) {
      return setDigits(6);
    } else {
      return setDigits(value);
    }

  }
  return <span>
    <h5>{`Set Length (current: ${digits})`}</h5>
    <input onChange={e=>setCorrectDigits(parseInt(e.target.value))} />
    {/* Add option to enter number (not random) */}
    <button onClick={startGame}>Start Game</button>
  </span>
}

function WinState({restartGame}) {
  return <>
    <h1>YOU WIN!</h1>
    <button style={{width: 200, alignSelf: 'center'}} onClick={restartGame}>Play again?</button>
  </>
}

function GameState({answer, setNumberInput, numberInput, checkCombo, counter}) {
  return <>
    <h1>{answer}</h1>
    <h5>Choose a number:</h5>
    <input onChange={e => setNumberInput(e.target.value)} style={{width: 300, alignSelf: 'center'}} value={numberInput} />
    <button style={{alignSelf: 'center', marginTop: 10, height: 20, width: 200}} onClick={checkCombo}>Check Combination</button>
    {(counter !== null) && `${counter} clicks.`}
  </>
}

function Guesses({guesses}) {
  return <>
    <h1>Guesses:</h1>
    <ol style={{display: 'flex', flexWrap: 'wrap'}}>
      {guesses.length > 0 && guesses.map((g, i) =><li key={i} style={{padding: 30, marginRight: 20}}>{`[${g.guess}] - ${g.clicks} clicks`}</li>)}
    </ol>
  </>
}

function App() {
  const [digits, setDigits] = useState(4);
  const [numberInput, setNumberInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [counter, setCounter] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [mode, setMode] = useState('START')

  function restartGame() {
    setGuesses([]);
    setMode('START')
    setCounter(0);
    setAnswer('');
  }

  function generateRandomNumber(length) {
    setAnswer(Math.floor(Math.random()*(10 ** (length - 1) * 9)) + 10**(length -1));
  }

  function checkCombo() {
    if (!answer || !numberInput) return;
    const splitRandomNumber = answer.toString().split('');
    const splitNumberInput = numberInput.split('');
    let counter = 0;
    for (let i = 0; i < splitRandomNumber.length; i++) {
      if (splitRandomNumber[i] === splitNumberInput[i]) {
        counter++;
      }
    }
    const guessObj = {guess: numberInput, clicks: counter}
    setGuesses(old => old.concat(guessObj));
    setCounter(counter);
    setNumberInput('');
    if (counter > 0 && counter === digits) {
      setMode('END');
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} className="App">
      {mode === 'START' && <PreGameState
        digits={digits}
        setDigits={setDigits}
        setMode={setMode}
        generateRandomNumber={generateRandomNumber}
      />}
      {mode === 'PLAY' && <GameState
        checkCombo={checkCombo}
        counter={counter}
        numberInput={numberInput}
        answer={answer}
        setDigits={setDigits}
        setNumberInput={setNumberInput}
      />}
      {mode === 'END' && <WinState restartGame={restartGame} />}
      {mode !== 'START' && <Guesses guesses={guesses} />}
    </div>
  );
}

export default App;
