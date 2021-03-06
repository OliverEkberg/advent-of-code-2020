const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const numRows = 128; const numCols = 8
const inputIndexCutoff = Math.log2(numRows)

const binarySearch = (min, max, pattern) => {
  for (const p of pattern) {
    if (p === 1) {
      min += (max - min + 1) / 2
    } else {
      max -= (max - min + 1) / 2
    }
  }
  return min
}

const getSeatId = (str) => {
  const rowPart = str.substr(0, inputIndexCutoff)
  const colPart = str.substr(inputIndexCutoff)

  const rowArr = []
  for (let i = 0; i < rowPart.length; i++) {
    rowArr.push(rowPart[i] === 'B' ? 1 : 0)
  }

  const colArr = []
  for (let i = 0; i < colPart.length; i++) {
    colArr.push(colPart[i] === 'R' ? 1 : 0)
  }

  const row = binarySearch(0, numRows - 1, rowArr)
  const col = binarySearch(0, numCols - 1, colArr)
  return row * 8 + col
}

let highestId = -1
for (const str of data) {
  const id = getSeatId(str)
  if (id > highestId) {
    highestId = id
  }
}

console.log(highestId)
