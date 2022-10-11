import "./style.css"

import React from "react"

export default function Scoreboard(props) {
  return (
    <div className="scoreboard">
      <div className="statistics">
        <div className="rolls-best">
          <p>Best Rolls</p>
          <p className="gradient-text">{props.bestRolls}</p>
        </div>
        <div className="time-best">
          <p>Best Time</p>
          <p className="gradient-text">{props.bestTime / 100}s</p>
        </div>
      </div>
    </div>
  )
}