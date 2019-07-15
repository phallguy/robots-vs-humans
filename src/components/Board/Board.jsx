import React from "react"

import Pawn from "../Pawn"

import "./styles.css"

function renderPawn({ board, allowed, x, y, size, onAllowed }) {
  const pawn = board.pawnAt({ x, y })

  if (!pawn) return null

  return (
    <Pawn key={pawn.id} pawn={pawn} allowed={allowed} size={size} onAllowed={onAllowed} />
  )
}

const Board = ({ board, size, onAllowed }) => {
  const allowed = board.allowedMoves()

  return (
    <table className={`board board-size-${size}`}>
      <tbody>
        {board.mapY(y => (
          <tr key={y}>
            {board.mapX(x => (
              <td key={x}>{renderPawn({ board, allowed, x, y, size, onAllowed })}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Board.defaultProps = {
  size: "default"
}

export default Board
