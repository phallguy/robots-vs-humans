class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Pawn {
  constructor({ position, status, type }) {
    this.position = position
    this.status = status || "alive"
    this.type = type
  }
}

export default class BoardState {
  constructor(size) {
    this.size = size
    this.humans = Array.from(Array(size)).map(
      (_, x) => new Pawn({ position: new Position(x, size - 1), type: "human" })
    )
    this.robots = Array.from(Array(size)).map(
      (_, x) => new Pawn({ position: new Position(x, 0), type: "robot" })
    )
  }

  pawnAt({ x, y }) {
    return (
      this.humans.find(p => p.position.x === x && p.position.y === y) ||
      this.robots.find(p => p.position.x === x && p.position.y === y)
    )
  }

  mapY(callback) {
    return Array.from(Array(this.size)).map((_, y) => callback(y))
  }

  mapX(callback) {
    return Array.from(Array(this.size)).map((_, x) => callback(x))
  }

  allowedMoves(type) {
    const direction = type === "robot" ? 1 : -1
    const movers = this.pawns(type)
    const allowed = []

    movers.forEach(pawn => {
      const { x, y } = pawn.position

      if (this.canAttack({ pawn, x: x - 1, y: y + direction })) {
        allowed.push({ pawn, x: x - 1, y: y + direction, direction, attack: true })
      }

      if (this.canAttack({ pawn, x: x + 1, y: y + direction })) {
        allowed.push({ pawn, x: x + 1, y: y + direction, direction, attack: true })
      }

      if (!this.pawnAt({ x, y: y + direction })) {
        allowed.push({ pawn, x, y: y + direction, direction })
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

  pawns(type) {
    return type === "robot" ? this.robots : this.humans
  }
}
