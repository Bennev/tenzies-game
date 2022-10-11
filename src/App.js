import './App.css';

import React from "react"
import Die from "./components/Die"
import Footer from "./components/Footer"
import Scoreboard from './components/Scoreboard';
import {nanoid} from "nanoid"
import ReactConfetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [bestRolls, setBestRolls] = React.useState(
        JSON.parse(localStorage.getItem("bestRolls")) || 0
    )
    const [time, setTime] = React.useState(0)
    const [bestTime, setBestTime] = React.useState(
        JSON.parse(localStorage.getItem("bestTime")) || 0
    )
    const [start, setStart] = React.useState(true)

    React.useEffect(() => {
        let interval = null;
        if (start) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10)
            }, 10)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [start])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setStart(false)
            setRecords()
        }
    }, [dice])

    function setRecords() {
        if (!bestRolls || rolls < bestRolls) {
            setBestRolls(rolls)
        }
        
        const timeFloored = Math.floor(time/10)
        if (!bestTime || timeFloored < bestTime) {
            setBestTime(timeFloored)
        }
    }

    React.useEffect(() => {
        localStorage.setItem("bestRolls", JSON.stringify(bestRolls));
      }, [bestRolls])

    React.useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
    }, [bestTime])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
      if(!tenzies) {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
            die :
            generateNewDie()
        }))
        setRolls(rolls + 1)
      } else {
        setTenzies(false)
        setDice(allNewDice())
        setRolls(0)
        setStart(true)
        setTime(0)
      }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <div>
            <main>
                {tenzies && <ReactConfetti />}
                <h1 className="title">TENZIES</h1>
                {tenzies ? <p className="winner gradient-text">YOU WON!</p> : (
                    <p className="instructions">
                        Roll until all dice are the same.
                        <br /> Click each die to freeze it at its current value between rolls.
                    </p>
                )}
                <div className="statistics">
                    <p>{`Rolls: ${rolls}`}</p>
                    <p>Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:{("0" + ((time / 10) % 1000)).slice(-2)}</p>
                </div>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>

                <Scoreboard bestRolls={bestRolls} bestTime={bestTime} />
            </main>
            <Footer />
        </div>
    )
}