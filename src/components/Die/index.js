import './style.css'

import React from 'react'

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? '#59E391' : 'white'
  }

  let cls = 'odd-'
  if (props.value % 2 === 0) {
    cls = 'even-'
  }

  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
        {[...Array(props.value).keys()].map((event, index) => {
            return <div key={index} className={`dot ${cls}${index + 1}`}></div>
        })}
    </div>
  )
}