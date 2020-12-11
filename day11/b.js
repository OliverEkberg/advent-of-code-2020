const fs = require('fs')
let data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(str => str.split(''))

const createMatrix = (numRows, numCols) => {
  const matrix = []
  for (let i = 0; i < numRows; i++) {
    const tmp = []
    matrix.push(tmp)
    for (let j = 0; j < numCols; j++) {
      tmp.push(undefined)
    }
  }
  return matrix
}

const FLOOR = '.'
const EMPTY = 'L'
const OCCUPIED = '#'

const nextVal = (row, col) => {
  if (data[row][col] === FLOOR) return [false, FLOOR]

  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0]
  ]

  let numOccupied = 0
  for (const [dx, dy] of directions) {
    let i = row + dy
    let j = col + dx

    while (i >= 0 && i < data.length && j >= 0 && j < data[i].length) {
      if ([EMPTY, OCCUPIED].includes(data[i][j])) {
        if (data[i][j] === OCCUPIED) numOccupied++
        break
      }

      i += dy
      j += dx
    }
  }

  const isEmpty = data[row][col] === EMPTY
  if (isEmpty && numOccupied === 0) {
    return [true, OCCUPIED]
  }
  if (!isEmpty && numOccupied >= 5) {
    return [true, EMPTY]
  }
  return [false, data[row][col]]
}

let numChanges
let numOccupied

do {
  // Reset each iteration
  numChanges = 0
  numOccupied = 0

  const tmp = createMatrix(data.length, data[0].length)

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const [changed, newVal] = nextVal(i, j)
      if (changed) numChanges++
      if (newVal === OCCUPIED) numOccupied++
      tmp[i][j] = newVal
    }
  }

  data = tmp
} while (numChanges > 0)

console.log(numOccupied)
