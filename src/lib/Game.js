export let id = 1
function uniqueId() {
  // eslint-disable-next-line
  return id++
}

class Pawn {
  constructor({ x, y, status, type }) {
    this.x = x
    this.y = y
    this.status = status || "alive"
    this.type = type
    this.id = uniqueId()
  }

  moveTo({ x, y }) {
    return new Pawn({
      type: this.type,
      status: this.status,
      x,
      y,
    })
  }

  die() {
    return new Pawn({
      type: this.type,
      status: "dead",
      x: null,
      y: null,
    })
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePawns(size) {
  const pawns = []

  Array.from(Array(size)).forEach((_, x) => {
    pawns.push(new Pawn({ x, y: size - 1, type: "white" }))
    pawns.push(new Pawn({ x, y: 0, type: "black" }))
  })

  return pawns
}

export class Board {
  constructor({ size, pawns, turn, parent, move, weight }) {
    this.size = size
    this.weight = weight || 3
    this.turn = turn || "white"
    this.pawns = pawns || generatePawns(size)
    this.move = move
    this.moves = {}
    this.parent = parent
    this.id = uniqueId()
  }

  pawnAt({ x, y }) {
    return this.pawns.find(p => p.x === x && p.y === y)
  }

  mapY(callback) {
    return Array.from(Array(this.size)).map((_, y) => callback(y))
  }

  mapX(callback) {
    return Array.from(Array(this.size)).map((_, x) => callback(x))
  }

  allowedMoves() {
    return this.isGameOver() ? [] : this.candidateMoves()
  }

  candidateMoves() {
    const direction = this.turn === "black" ? 1 : -1
    const allowed = []

    this.pawns.forEach(pawn => {
      const { type, x, y, status } = pawn
      const nextY = y + direction

      if (status !== "alive") return
      if (type !== this.turn) return

      if (this.canAttack({ pawn, x: x - 1, y: nextY })) {
        allowed.push({
          pawn,
          x: x - 1,
          y: nextY,
          direction,
          attack: true,
          id: uniqueId(),
        })
      }

      if (this.canAttack({ pawn, x: x + 1, y: nextY })) {
        allowed.push({
          pawn,
          x: x + 1,
          y: nextY,
          direction,
          attack: true,
          id: uniqueId(),
        })
      }

      if (nextY >= 0 && nextY < this.size && !this.pawnAt({ x, y: nextY })) {
        allowed.push({
          pawn,
          x,
          y: nextY,
          direction,
          id: uniqueId(),
        })
      }
    })

    const weight = this.weight
    // eslint-disable-next-line
    allowed.forEach(move => {
      move.id = uniqueId()
      move.weight = weight
    })

    // Memoize
    this.candidateMoves = () => allowed

    return allowed
  }

  canAttack({ pawn, x, y }) {
    const targetPawn = this.pawnAt({ x, y })

    if (!targetPawn) return false
    if (targetPawn.type === pawn.type) return false

    return true
  }

  playMove(move) {
    if(!move) return

    let board = this.moves[move.id]
    if (board) return board

    const { pawn, x, y } = move
    const nextPawns = this.pawns.map(p => {
      if (p === pawn) {
        return p.moveTo({ x, y })
      }

      if (p.x === x && p.y === y) {
        return p.die()
      }

      return p
    })

    board = new Board({
      turn: this.nextTurn(),
      size: this.size,
      pawns: nextPawns,
      parent: this,
      weight: this.weight,
      move,
    })

    this.moves[move.id] = board
    return board
  }

  nextTurn() {
    return this.turn === "black" ? "white" : "black"
  }

  isGameOver() {
    let gameOver = false

    gameOver =
      gameOver ||
      this.pawns.find(
        p => p.type === "black" && p.status === "alive" && p.y === this.size - 1
      )
    gameOver =
      gameOver ||
      this.pawns.find(
        p => p.type === "white" && p.status === "alive" && p.y === 0
      )
    gameOver = gameOver || this.candidateMoves().length === 0

    // Memoize
    this.isGameOver = () => gameOver
    return gameOver
  }

  guessMove() {
    const allowed = this.allowedMoves()
    if (!allowed.length) return null

    const guess = getRandomInt(0, allowed.length - 1)
    return allowed[guess]
  }

  guessOptimalMove() {
    const allowed = this.allowedMoves()
    if (!allowed.length) return null

    let guess = getRandomInt(0, allowed.length * this.weight - 1)
    let move = null
    allowed.forEach( m => {
      if(move) return

      if(guess > m.weight) {
        guess -= m.weight
      } else {
        move = m
      }
    })

    return move
  }

  learn(move, winner) {
    if (!move) {
      this.parent.learn(this.move, this.nextTurn())
      return
    }

    if (this.turn === winner) this.promoteMove(move)
    else this.demoteMove(move)

    if (this.parent) this.parent.learn(this.move, winner)
  }

  promoteMove(move) {
    const allowed = this.allowedMoves()
    const index = allowed.indexOf(move)

    let stealFrom = (index + 1) % allowed.length
    while (allowed[stealFrom].weight === 0) {
      stealFrom = (stealFrom + 1) % allowed.length
    }

    move.weight += 1
    allowed[stealFrom].weight -= 1
  }

  demoteMove(move) {
    if (move.weight === 0) return

    const allowed = this.allowedMoves()
    const index = allowed.indexOf(move)

    let giveTo = (index - 1 + allowed.length) % allowed.length

    move.weight -= 1
    allowed[giveTo].weight += 1
  }
}

export default class Game {
  constructor({ size, weight }) {
    this.current = new Board({ size, weight })
  }

  generate() {
    const { current } = this
    const allowed = current.allowedMoves()

    return allowed.map(move => current.move(move))
  }
}
