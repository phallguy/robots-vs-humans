import React from "react"

import "./styles.css"

function renderAllowed(pawn, allowed) {
  return allowed.map(move => {
    if (move.pawn !== pawn) return null

    return <Move key={move} {...move} />
  })
}

const Move = ({ pawn, x, direction, attack }) => {
  const { x: pawnX } = pawn.position
  const heading = pawnX === x ? "down" : pawnX < x ? "left" : "right"

  return (
    <span
      className={`move heading-${heading} direction-${
        direction > 0 ? "down" : "up"
      } attack-${!!attack}`}
    />
  )
}

const Pawn = ({ pawn, allowed }) => (
  <>
    <div className={`pawn ${pawn.type}`} />
    {allowed && renderAllowed(pawn, allowed)}
  </>
)

export default Pawn
