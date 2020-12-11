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

  let numOccupied = 0
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) continue

      if (data?.[i]?.[j] === OCCUPIED) {
        numOccupied++
      }
    }
  }

  const isEmpty = data[row][col] === EMPTY
  if (isEmpty && numOccupied === 0) {
    return [true, OCCUPIED]
  }
  if (!isEmpty && numOccupied >= 4) {
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
