import React from "react"

import Layout from "../components/layout"
import Board from "../components/Board"
import BoardState from "../lib/BoardState"

const boardState = new BoardState(3)

const IndexPage = () => (
  <Layout>
    <Board board={boardState} />
  </Layout>
)

export default IndexPage
