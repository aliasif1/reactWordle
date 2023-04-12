import React, { useEffect, useState } from 'react';
import { Snackbar } from "@mui/material";
import words from '../assets/words';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const Board = () => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [SOL,setSOL] = useState(words[Math.floor(Math.random() * words.length)]); // the word to guess
    const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(""));
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0)
    let currentWord = guesses[currentGuessIndex];
    const keydownEventHandler = (event) => {
        const val = event.key.toUpperCase();
        updateGuess(val);
    }

    const uiKeyPressHandler = (val) => {
        if(val === 'DEL'){
            val = 'BACKSPACE';
        }
        else if(val === 'SAVE'){
            val = 'ENTER';
        }
        updateGuess(val);
    }

    const updateGuess = (val) => {
        if(val === 'ENTER'){
            if(currentWord.length !== WORD_LENGTH){
                return; 
            }
            if(currentWord === SOL){
                setSnackbarMessage('Congratulations! You guessed the correct word')
                setShowSnackbar(true);
                setCurrentGuessIndex(0);
                setGuesses(Array(MAX_GUESSES).fill(""));
                newGame();
                return;
            }
            if(currentGuessIndex === MAX_GUESSES - 1){
                setSnackbarMessage(`Oops! The correct word was ${SOL}`)
                setShowSnackbar(true);
                setCurrentGuessIndex(0);
                setGuesses(Array(MAX_GUESSES).fill(""));
                newGame();
                return;
            }
            setCurrentGuessIndex(prevIndex => prevIndex+1);
            return;
        }
        else if(val === 'BACKSPACE'){
            if(currentWord.length === 0){
                return 
            }
            currentWord = currentWord.slice(0, -1) //remove last word 
        }
        else{
            if(currentWord.length === WORD_LENGTH){
                return 
            }
            if(!/^[A-Z]+$/.test(val)){
                return;
            }
            currentWord = currentWord + val;
        }
        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses]
            newGuesses[currentGuessIndex] = currentWord
            return newGuesses;
        })
    }
    
    useEffect(() => {
        window.addEventListener('keydown', keydownEventHandler);
        return () => {
            window.removeEventListener('keydown', keydownEventHandler);
        }
    }, [keydownEventHandler]);

    const newGame = () => {
        setSOL(words[Math.floor(Math.random() * words.length)]);
    }

    const getWordLine = (word, index) => {
        let alphabetArr = []
        for(let i=0; i<WORD_LENGTH; i++){
            let classes = 'alphabet';
            if(index < currentGuessIndex){
                if(word[i]){
                    if(SOL.indexOf(word[i]) !== -1){
                        classes = classes + ' found';
                    }
                    if(word[i] === SOL[i]){
                        classes = classes + ' match';
                    }
                }
            }
            alphabetArr.push(
                <div className={classes} key={i}>
                    {word[i]??''}
                </div>
            );
        }
        return <div className="word" key={index}>
            {alphabetArr}
        </div>
    }

    const getKeyboard = () => {
        let line1 = ['Q','W','E','R','T','Y','U','I','O','P'];
        let line2 = ['A','S','D','F','G','H','J','K','L'];
        let line3 = ['Z','X','C','V','B','N','M','DEL','SAVE'];
        let listLine1 = line1.map((letter, index) => <div key={index} className="keyboard-letter" onClick={() => uiKeyPressHandler(letter)}>{letter}</div>);
        let listLine2 = line2.map((letter, index) => <div key={index} className="keyboard-letter" onClick={() => uiKeyPressHandler(letter)}>{letter}</div>);
        let listLine3 = line3.map((letter, index) => <div key={index} className="keyboard-letter" onClick={() => uiKeyPressHandler(letter)}>{letter}</div>);
        return <div className="keyboard">
            <div className="keyboard-line" key="1">{listLine1}</div>
            <div className="keyboard-line" key="2">{listLine2}</div>
            <div className="keyboard-line" key="3">{listLine3}</div>
        </div>
    }

    return(
        <>
            <Snackbar
                open={showSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
                message={snackbarMessage} 
                onClose={() => {setShowSnackbar(false)}}
            />
            <div className="board">
                <h1 className="title">WORDLE++</h1>
                <div className="guess-grid">
                    {
                        guesses.map((guess, guessIndex) => {
                            return getWordLine(guess, guessIndex);
                        })
                    }
                </div>
                <div className="keyboard">
                    {getKeyboard()}
                </div>
        </div>
        </>
    );
};

export default Board;