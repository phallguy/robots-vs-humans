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
  const [optimal, setOptimal] = useState(true)
  const [games, setGames] = useState(0)
  const [wins, setWins] = useState({ black: 0, white: 0 })
  const [winner, setWinner] = useState()

  const makeMove = useCallback(
    move => {
      if (!board.isGameOver()) {
        const nextBoard = board.playMove(move)
        setBoard(nextBoard)
        setBoards([board, ...boards])
        if (nextBoard.isGameOver()) {
          setGames(games + 1)
          setWins({
            black: board.turn === "black" ? wins.black + 1 : wins.black,
            white: board.turn === "white" ? wins.white + 1 : wins.white,
          })
          setWinner(board.turn)

          nextBoard.learn()
        }
      }
    },
    [board]
  )

  const play = useCallback(() => {
    if (board.isGameOver()) reset()
    else makeMove(board[optimal ? "guessOptimalMove" : "guessMove"]())
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
          New Game
        </button>{" "}
        <button type="button" onClick={toggleAutoPlay}>
          Auto Play
        </button>{" "}
        <label>
          <input
            type="checkbox"
            onChange={e => setOptimal(e.target.checked)}
            checked={optimal}
          />{" "}
          optimal
        </label>{" "}
        objects:
        {objectCount}
      </div>
      <div>
        Games played {games} Black: {wins.black} (
        {(wins.black / games).toFixed(2) * 100}%) White: {wins.white} (
        {(wins.white / games).toFixed(2) * 100}%)
      </div>
      <div>Last winner: {winner}</div>
      <br />
      <div>
        <Board board={board} onAllowed={makeMove} size="default" />
        <AllowedMoves allowed={board.allowedMoves()} />
      </div>
      <div>
        <button type="button" onClick={play}>
          Next Move
        </button>{" "}
      </div>
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
