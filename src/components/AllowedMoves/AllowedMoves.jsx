import React from "react"

import "./styles.css"

const AllowedMoves = ({ allowed }) => {
  return (
    <table className="allowedMoves">
      <tbody>
        <tr>
          <td>{allowed.length}: </td>
          {allowed.map(move => (
            <td key={move.id}>{move.weight.toFixed(2)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default AllowedMoves
