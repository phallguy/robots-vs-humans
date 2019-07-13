import React, { useState, useCallback } from "react"

import Layout from "../components/layout"
import Board from "../components/Board"
import Game from "../lib/BoardState"

const game = new Game({ size: 3 })

const IndexPage = () => {
  const [board, setBoard] = useState(game.current)
  const nextMove = useCallback(() => {
    const allowed = board.allowedMoves()
    if (allowed.length) setBoard(board.move(allowed[0]))
  })

  return (
    <Layout>
      <div>
        <Board board={board} />
      </div>
      <div>
        <button type="button" onClick={nextMove}>Next</button>
      </div>
    </Layout>
  )
}

export default IndexPage
