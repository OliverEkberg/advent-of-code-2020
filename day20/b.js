const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')

const idRx = /Tile (\d+):/

const tileMap = new Map()
const fullTileMap = new Map()

for (const row of data) {
  const [title, ...tile] = row.split('\n')
  const [, id] = title.match(idRx).map(Number)

  const tileSides = [
    '',
    '',
    '',
    ''
  ]

  tileSides[0] = tile[0]
  tileSides[2] = tile[tile.length - 1]
  for (let i = 0; i < tile.length; i++) {
    tileSides[1] = tileSides[1] + tile[i][tile[i].length - 1]
    tileSides[3] = tileSides[3] + tile[i][0]
  }

  tileMap.set(id, tileSides)
  fullTileMap.set(id, tile)
}

const sideOccurrenceMap = new Map()

for (const [id, sides] of tileMap) {
  for (const side of sides) {
    const sideAndReverse = [side, [...side].reverse().join('')]
    for (const side of sideAndReverse) {
      if (!sideOccurrenceMap.has(side)) {
        sideOccurrenceMap.set(side, [])
      }
      sideOccurrenceMap.get(side).push(id)
    }
  }
}

const edgeMap = new Map()
for (const [side, ids] of sideOccurrenceMap) {
  // If side only appeared once it must be a part of the edge
  if (ids.length === 1) {
    const id = ids[0]

    if (!edgeMap.has(id)) {
      edgeMap.set(id, [])
    }

    edgeMap.get(id).push(side)
  }
}

// Create empty square matrix
const size = Math.sqrt(tileMap.size)
const matrix = []
for (let i = 0; i < size; i++) {
  const tmp = []
  for (let j = 0; j < size; j++) {
    tmp.push(undefined)
  }
  matrix.push(tmp)
}

const reverse = str => [...str].reverse().join('')

const rotateSides = (sides) => {
  const [t, r, b, l] = sides
  return [reverse(l), t, reverse(r), b]
}

const flipSides = (sides) => {
  const [t, r, b, l] = sides
  return [reverse(t), l, reverse(b), r]
}

const rotateMatrixArray = arr => {
  const matrix = arr.map(row => row.split(''))

  const rotated = matrix.map((row, i) =>
    row.map((_, j) => matrix[matrix.length - 1 - j][i])
  )

  return rotated.map(row => row.join(''))
}

const rotateMatrix = matrix => {
  return matrix.map((row, i) =>
    row.map((_, j) => matrix[matrix.length - 1 - j][i])
  )
}

const flipMatrixArray = matrix => {
  return matrix.map(reverse)
}

const flipMatrix = matrix => {
  return flipMatrixArray(matrix.map(row => row.join(''))).map(row => row.split(''))
}

const tryAll = (arr, val, pos, full) => {
  let tmp = [...arr]
  let tmpFull = JSON.parse(JSON.stringify(full))

  for (let i = 0; i < 4; i++) {
    if (tmp[pos] === val) {
      return [tmp, tmpFull]
    }

    tmp = rotateSides(tmp)
    tmpFull = rotateMatrixArray(tmpFull)
  }

  tmp = flipSides(tmp)
  tmpFull = flipMatrixArray(tmpFull)

  for (let i = 0; i < 4; i++) {
    if (tmp[pos] === val) {
      return [tmp, tmpFull]
    }

    tmp = rotateSides(tmp)
    tmpFull = rotateMatrixArray(tmpFull)
  }
}

matrix[0][0] = [3833, rotateSides(rotateSides(rotateSides(['####....#.', '.#.#####.#', '.##.###.##', '#..##.###.']))), rotateMatrixArray(rotateMatrixArray(rotateMatrixArray(fullTileMap.get(3833))))]

for (let row = 0; row < size; row++) {
  for (let col = 0; col < size; col++) {
    if (row === 0 && col === 0) continue

    if (col === 0) {
      const [bId, bT] = matrix[row - 1][col]
      const side = bT[2]
      const nextId = sideOccurrenceMap.get(side).filter(v => v !== bId)[0]
      const next = tileMap.get(nextId)
      const nextFull = fullTileMap.get(nextId)

      matrix[row][col] = [nextId, ...tryAll(next, side, 0, nextFull)]
    } else {
      const [bId, bT] = matrix[row][col - 1]
      const side = bT[1]
      const nextId = sideOccurrenceMap.get(side).filter(v => v !== bId)[0]
      const next = tileMap.get(nextId)
      const nextFull = fullTileMap.get(nextId)

      matrix[row][col] = [nextId, ...tryAll(next, side, 3, nextFull)]
    }
  }
}

let fullMatrix = []

for (const row of matrix) {
  for (let i = 0; i < row.length; i++) {
    row[i][2].pop()
    row[i][2].shift()
    row[i][2] = row[i][2].map(row => row.substring(1, row.length - 1))
  }
}

for (const row of matrix) {
  for (let i = 0; i < row[0][2].length; i++) {
    fullMatrix.push(
      row.map(col => col[2][i]).join('').split('')
    )
  }
}

const testMonster = (matrix, x, y) => {
  const points = [
    [x, y + 1],
    [x + 1, y + 2],
    [x + 4, y + 2],
    [x + 5, y + 1],
    [x + 6, y + 1],
    [x + 7, y + 2],
    [x + 10, y + 2],
    [x + 11, y + 1],
    [x + 12, y + 1],
    [x + 13, y + 2],
    [x + 16, y + 2],
    [x + 17, y + 1],
    [x + 18, y + 1],
    [x + 18, y + 0],
    [x + 19, y + 1]
  ]

  const isMonster = points
    .map(([x, y]) => matrix?.[y]?.[x])
    .every(val => val === '#')

  if (isMonster) {
    points.forEach(([x, y]) => { matrix[y][x] = 'O' })
  }

  return isMonster
}

for (let k = 0; k < 4; k++) {
  let anyFound = false
  for (let i = 0; i < fullMatrix.length; i++) {
    for (let j = 0; j < fullMatrix[i].length; j++) {
      anyFound = testMonster(fullMatrix, j, i) || anyFound
    }
  }

  if (anyFound) {
    console.log(fullMatrix.flat().filter(char => char === '#').length)
  }

  fullMatrix = rotateMatrix(fullMatrix)
}

fullMatrix = flipMatrix(fullMatrix)

for (let k = 0; k < 4; k++) {
  let anyFound = false
  for (let i = 0; i < fullMatrix.length; i++) {
    for (let j = 0; j < fullMatrix[i].length; j++) {
      anyFound = testMonster(fullMatrix, j, i) || anyFound
    }
  }

  if (anyFound) {
    console.log(fullMatrix.flat().filter(char => char === '#').length)
  }

  fullMatrix = rotateMatrix(fullMatrix)
}
