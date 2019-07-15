import React, { useState, useCallback, useEffect } from "react"

import Layout from "../components/layout"
import Board from "../components/Board"
import Game, { id as objectCount } from "../lib/Game"
import AllowedMoves from "../components/AllowedMoves"

const game = new Game({ size: 3, weight: 5 })

const IndexPage = () => {
  const [board, setBoard] = useState(game.current)
  const [boards, setBoards] = useState([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [training, setTraining] = useState(false)

  const makeMove = useCallback(
    move => {
      if (!board.isGameOver()) {
        const nextBoard = board.playMove(move)
        setBoard(nextBoard)
        setBoards([board, ...boards])
        if (nextBoard.isGameOver()) nextBoard.learn()
      }
    },
    [board]
  )

  const play = useCallback(() => {
    if (board.isGameOver()) reset()
    else makeMove(board[training ? "guessMove" : "guessOptimalMove"]())
  }, [board])

  const reset = useCallback(() => {
    setBoard(game.current)
    setBoards([])
  })

  useEffect(() => {
    if (autoPlay) play()
  })

  const toggleAutoPlay = useCallback(() => setAutoPlay(!autoPlay), [autoPlay])

  return (
    <Layout>
      <div>
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={play}>
          Play
        </button>
        <button type="button" onClick={toggleAutoPlay}>
          Auto Play
        </button>
        <label>
          <input
            type="checkbox"
            onChange={e => setTraining(e.target.checked)}
            checked={training}
          />
          train
        </label>
        { ' ' }
        objects:
        {objectCount}
      </div>
      <br />
      <div>
        <Board board={board} onAllowed={makeMove} size="default" />
        <AllowedMoves allowed={board.allowedMoves()} />
      </div>
      {board.isGameOver() && <h2>Winner: {board.nextTurn()}</h2>}
      <div>
        {false &&
          boards.map(board => (
            <div key={board}>
              <Board board={board} />
              <AllowedMoves allowed={board.allowedMoves()} />
            </div>
          ))}
      </div>
    </Layout>
  )
}

export default IndexPage
