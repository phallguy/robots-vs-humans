let id = 100
function uniqueId() {
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

function generatePawns(size) {
  const pawns = []

  Array.from(Array(size)).forEach((_, x) => {
    pawns.push(new Pawn({ x, y: size - 1, type: "human" }))
    pawns.push(new Pawn({ x, y: 0, type: "robot" }))
  })

  return pawns
}

export class Board {
  constructor({ size, pawns, turn }) {
    this.size = size
    this.turn = turn || "human"
    this.pawns = pawns || generatePawns(size)
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
    const direction = this.turn === "robot" ? 1 : -1
    const allowed = []

    this.pawns.forEach(pawn => {
      const { type, x, y } = pawn

      if (type !== this.turn) return

      if (this.canAttack({ pawn, x: x - 1, y: y + direction })) {
        allowed.push({
          pawn,
          x: x - 1,
          y: y + direction,
          direction,
          attack: true,
          id: uniqueId(),
        })
      }

      if (this.canAttack({ pawn, x: x + 1, y: y + direction })) {
        allowed.push({
          pawn,
          x: x + 1,
          y: y + direction,
          direction,
          attack: true,
          id: uniqueId(),
        })
      }

      if (!this.pawnAt({ x, y: y + direction })) {
        allowed.push({
          pawn,
          x,
          y: y + direction,
          direction,
          id: uniqueId(),
        })
      }
    })

    return allowed
  }

  canAttack({ pawn, x, y }) {
    const targetPawn = this.pawnAt({ x, y })

    if (!targetPawn) return false
    if (targetPawn.type === pawn.type) return false

    return true
  }

  move({ pawn, x, y }) {
    const nextPawns = this.pawns.map(p => {
      if (p === pawn) {
        return p.moveTo({ x, y })
      }

      if (p.x === x && p.y === y) {
        return p.die()
      }

      return p
    })

    return new Board({
      turn: this.turn === "robot" ? "human" : "robot",
      size: this.size,
      pawns: nextPawns,
    })
  }

  isGameOver() {
    return this.allowedMoves().length === 0
  }
}

export default class Game {
  constructor({ size }) {
    this.current = new Board({ size })
  }

  generate() {
    const { current } = this
    const allowed = current.allowedMoves()

    return allowed.map(move => current.move(move))
  }
}
