import './App.css';

import React, { useCallback } from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [countNumberRoll, setCountNumberRoll] = React.useState(0)
    // const [timer, setTimer] = React.useState(0)

    // React.useEffect (() => {
    //     const intervalId = setInterval(updateTimer, 1000)

    //     return () => clearInterval(intervalId)
    // }, [])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    // const updateTimer = React.useCallback(() => {
    //   setTimer(timer + 1)
    //   console.log(timer)
    // }, [timer])

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
          setCountNumberRoll(countNumberRoll + 1)
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
      } else {
          setCountNumberRoll(0)
          setTenzies(false)
          setDice(allNewDice())
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
        <main>
            {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
            <h1 className="title">Tenzies</h1>
            <div className="instructions">
                <p>Role os dados até que os valores sejam os mesmos.</p>
                <p>Clique em cada dado para congelar seu valor durante as rolagens.</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="statistics">
                <p>{`Number of Rolls: ${countNumberRoll}`}</p>
                {/* <p>{`Timer: ${timer}`}</p> */}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}