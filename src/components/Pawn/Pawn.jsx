import React from "react"

import "./styles.css"

function renderAllowed(pawn, allowed, onAllowed) {
  return allowed.map(move => {
    if (move.pawn !== pawn) return null

    return (
      <Move
        key={move.id}
        title={move.id}
        {...move}
        onClick={onAllowed && (() => onAllowed(move))}
      />
    )
  })
}

const Move = ({ pawn, x, direction, attack, size, onClick, ...other }) => {
  const { x: pawnX } = pawn
  // eslint-disable-next-line
  const heading = pawnX === x ? "down" : pawnX < x ? "right" : "left"

  return (
    <span
      {...other}
      className={`move move-size-${size} heading-${heading} direction-${
        direction > 0 ? "down" : "up"
      } attack-${!!attack}`}
      onClick={onClick}
    />
  )
}

const Pawn = ({ pawn, allowed, size, onAllowed }) => (
  <>
    <div className={`pawn pawn-size-${size} pawn-${pawn.type}`} />
    {allowed && size === "default" && renderAllowed(pawn, allowed, onAllowed)}
  </>
)

Pawn.defaultProps = {
  size: "default",
}

export default Pawn
