import React from "react"

import Pawn from "../Pawn"

import "./styles.css"

function renderPawn(board, allowed, x, y) {
  const pawn = board.pawnAt({ x, y })

  if (!pawn) return null

  return <Pawn pawn={pawn} allowed={allowed} />
}

const Board = ({ board }) => {
  const allowed = board.allowedMoves("robot")

  return (
    <div>
      <table className="board">
        <tbody>
          {board.mapY(y => (
            <tr key={y}>
              {board.mapX(x => (
                <td key={x}>{renderPawn(board, allowed, x, y)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Board
