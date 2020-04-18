import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function copyToClipboard(text) {
	const dummy = document.createElement('textarea');
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy');
	document.body.removeChild(dummy);
}

function PreGameState({ digits, setDigits, setGameState, gameMode, setGameMode, generateRandomNumber }) {
	function startGame(e) {
		if (!e.keyCode || e.keyCode === 13) {
			setGameState('PLAY');
			generateRandomNumber(digits);
		}
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
	return (
		<div>
			<div>{`Set Length of Combination`}</div>
			<input
				defaultValue={4}
				style={{ width: '50px' }}
				type="number"
				autoFocus
				max={6}
				min={1}
				onKeyDown={(e) => startGame(e)}
				onChange={(e) => setCorrectDigits(parseInt(e.target.value))}
			/>
			{/* Add option to enter number (not random) */}
			<h3>Select a mode:</h3>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
				<div style={{ textAlign: 'left' }}>
					<input
						type="radio"
						id="clicksOnly"
						name="gameMode"
						value="clicksOnly"
						defaultChecked
						onClick={() => setGameMode('clicks')}
					/>
					<label htmlFor="clicksOnly">Clicks only</label>
					<div />
					<input
						type="radio"
						id="clicksAndClacks"
						name="gameMode"
						value="clicksAndClacks"
						// checked={gameMode === 'clacks'}
						onClick={() => setGameMode('clacks')}
					/>
					<label htmlFor="clicksAndClacks">Clicks and Clacks</label>
				</div>
			</div>
			<button style={{ fontSize: '1.3em', height: '30px', width: '100px' }} onClick={startGame}>
				Start
			</button>
		</div>
	);
}

function WinState({ restartGame }) {
	return (
		<React.Fragment>
			<h1>YOU WIN!</h1>
			<button style={{ width: 200, alignSelf: 'center' }} onClick={restartGame}>
				Play again?
			</button>
		</React.Fragment>
	);
}

function GameState({ answer, setNumberInput, numberInput, checkCombo, clickCounter, clackCounter, gameMode }) {
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	});

	return (
		<React.Fragment>
			<h1>{answer}</h1>
			<h5>Choose a number:</h5>
			<input
				ref={inputRef}
				autoFocus
				onKeyDown={(e) => checkCombo(e)}
				onChange={(e) => setNumberInput(e.target.value)}
				style={{ width: 300, alignSelf: 'center' }}
				value={numberInput}
			/>
			<button style={{ alignSelf: 'center', marginTop: 10, height: 20, width: 200 }} onClick={checkCombo}>
				Check Combination
			</button>
			{clickCounter !== null && gameMode === 'clicks' && `${clickCounter} clicks.`}
			{clickCounter !== null && gameMode === 'clacks' && `${clickCounter} clicks, ${clackCounter} clacks.`}
		</React.Fragment>
	);
}

function Guesses({ guesses, gameMode }) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
			<h1>Guesses:</h1>
			<ol style={{ width: 200 }}>
				{guesses.length > 0 && gameMode === 'clicks' ? (
					guesses.map((g, i) => (
						<li key={i} style={{ marginTop: 10 }}>{`{ ${g.guess} } - ${g.clicks} click${g.clicks === 1
							? '.'
							: 's.'}`}</li>
					))
				) : (
					guesses.map((g, i) => (
						<li key={i} style={{ marginTop: 10 }}>{`{ ${g.guess} } - ${g.clicks} click${g.clicks === 1
							? ''
							: 's'}, ${g.clacks} clack${g.clacks === 1 ? '' : 's.'}`}</li>
					))
				)}
			</ol>
		</div>
	);
}

function App() {
	const [ digits, setDigits ] = useState(4);
	const [ numberInput, setNumberInput ] = useState('');
	const [ answer, setAnswer ] = useState('');
	const [ clickCounter, setClickCounter ] = useState(null);
	const [ clackCounter, setClackCounter ] = useState(null);
	const [ guesses, setGuesses ] = useState([]);
	const [ gameState, setGameState ] = useState('START');
	const [ gameMode, setGameMode ] = useState('clicks');

	function restartGame() {
		setGuesses([]);
		setGameState('START');
		setClickCounter(0);
		setClackCounter(0);
		setAnswer('');
	}

	function generateRandomNumber(length) {
		setAnswer(Math.floor(Math.random() * (10 ** (length - 1) * 9)) + 10 ** (length - 1));
	}

	function checkCombo(e) {
		if (!answer || !numberInput) return;
		// keyCode 13 === Enter
		if (e.keyCode && e.keyCode !== 13) return;
		if (numberInput && numberInput.length !== digits) return;
		const splitRandomNumber = answer.toString().split('');
		const splitNumberInput = numberInput.split('');
		let counter = 0;
		for (let i = 0; i < splitRandomNumber.length; i++) {
			if (splitNumberInput[i] === splitRandomNumber[i]) {
				counter++;
			}
		}
		const guessObj = { guess: numberInput, clicks: counter };
		// For each guess, the result is copied to clipboard
		copyToClipboard(`{ ${numberInput} } - ${counter} click${counter === 1 ? '' : 's'}.`);
		setGuesses((old) => old.concat(guessObj));
		setClickCounter(counter);
		setNumberInput('');
		if (counter > 0 && counter === digits) {
			setGameState('END');
		}
	}

	function checkCombo2(e) {
		if (!answer || !numberInput) return;
		// keyCode 13 === Enter
		if (e.keyCode && e.keyCode !== 13) return;
		if (numberInput && numberInput.length !== digits) return;
		const splitRandomNumber = answer.toString().split('');
		const splitNumberInput = numberInput.split('');
		let clickCounter = 0;
		let clackCounter = 0;
		let temp = splitRandomNumber;
		for (let i = 0; i < splitRandomNumber.length; i++) {
			if (splitNumberInput[i] === splitRandomNumber[i]) {
				temp.splice(i, 1, 'click');
				clickCounter++;
			}
		}
		for (let i = 0; i < splitRandomNumber.length; i++) {
			if (temp.includes(splitNumberInput[i])) {
				const foundIndex = temp.findIndex((a) => a === splitNumberInput[i]);
				temp.splice(foundIndex, 1, 'clack');
				clackCounter++;
			}
		}
		const guessObj = { guess: numberInput, clicks: clickCounter, clacks: clackCounter };
		// For each guess, the result is copied to clipboard
		copyToClipboard(
			`{ ${numberInput} } - ${clickCounter} click${clickCounter === 1 ? '' : 's'}, ${clackCounter} clacks.`,
		);
		setGuesses((old) => old.concat(guessObj));
		setClickCounter(clickCounter);
		setClackCounter(clackCounter);
		setNumberInput('');
		if (clickCounter > 0 && clickCounter === digits) {
			setGameState('END');
		}
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="App">
			{gameState === 'START' && (
				<PreGameState
					digits={digits}
					setDigits={setDigits}
					setGameState={setGameState}
					gameMode={gameMode}
					setGameMode={setGameMode}
					generateRandomNumber={generateRandomNumber}
				/>
			)}
			{gameState === 'PLAY' && (
				<GameState
					checkCombo={gameMode === 'clicks' ? checkCombo : checkCombo2}
					clickCounter={clickCounter}
					clackCounter={clackCounter}
					gameMode={gameMode}
					numberInput={numberInput}
					answer={answer}
					setDigits={setDigits}
					setNumberInput={setNumberInput}
				/>
			)}
			{gameState === 'END' && <WinState restartGame={restartGame} />}
			{gameState !== 'START' && <Guesses gameMode={gameMode} guesses={guesses} />}
		</div>
	);
}

export default App;
