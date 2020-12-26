const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const dirs = {
  se: { a: -1, b: 0, c: 1 },
  ne: { a: 0, b: 1, c: -1 },
  e: { a: -1, b: 1, c: 0 },
  sw: { a: 0, b: -1, c: 1 },
  nw: { a: 1, b: 0, c: -1 },
  w: { a: 1, b: -1, c: 0 }
}

const paths = []

// Extract paths from input
for (let row of data) {
  const path = []

  while (row.length) {
    let dir
    for (dir of Object.keys(dirs)) {
      if (row.substr(0, dir.length) === dir) break
    }

    path.push(dir)
    row = row.substr(dir.length)
  }

  paths.push(path)
}

const addCoords = (c1, c2) => {
  return {
    a: c1.a + c2.a,
    b: c1.b + c2.b,
    c: c1.c + c2.c
  }
}

const getNeighbours = (coord) => {
  return Object
    .values(dirs)
    .map(dir => addCoords(dir, coord))
}

let tiles = new Map()

const toString = (coord) => `${coord.a},${coord.b},${coord.c}`
const fromString = (sCoord) => {
  const [a, b, c] = sCoord.split(',').map(Number)
  return { a, b, c }
}

const flip = (coord) => {
  const sCoord = toString(coord)
  if (!tiles.has(sCoord)) {
    tiles.set(sCoord, false)
  }

  tiles.set(sCoord, !tiles.get(sCoord))
}

const countFlipped = (t) => {
  let numFlipped = 0
  for (const [, flipped] of t) {
    if (flipped) numFlipped++
  }

  return numFlipped
}

// Build initial floor (part A)
for (const path of paths) {
  let curr = { a: 0, b: 0, c: 0 }
  for (const dir of path) {
    curr = addCoords(curr, dirs[dir])
  }

  flip(curr)
}

console.log(`A: ${countFlipped(tiles)}`)

// To only add neighbors with atleast one more neighbour
const shouldAdd = (coord) => {
  return getNeighbours(coord)
    .map(n => tiles.has(toString(n)))
    .filter(n => n).length > 1
}

// Game of life (part B)
const generations = 100
for (let i = 1; i <= generations; i++) {
  const nextGen = new Map()

  const queue = []

  // We must at the very least check every tile in the previous generation
  for (const [sCoord] of tiles) queue.push(sCoord)
  const checked = new Set(queue)

  while (queue.length) {
    const curr = queue.pop()
    const currVal = tiles.get(curr)
    const neighbours = getNeighbours(fromString(curr))

    let numBlack = 0
    for (const neighbour of neighbours) {
      const neighbourString = toString(neighbour)
      if (tiles.get(neighbourString)) {
        numBlack++
      }
    }

    let nextVal = currVal
    if (currVal && (numBlack === 0 || numBlack > 2)) {
      nextVal = false
    } else if (!currVal && numBlack === 2) {
      nextVal = true
    }

    nextGen.set(curr, nextVal)

    const neighbourStrCoordinates = neighbours.map(n => toString(n))
    for (const strCoordinate of neighbourStrCoordinates) {
      const coordinate = fromString(strCoordinate)
      if (!shouldAdd(coordinate)) continue

      if (!checked.has(strCoordinate)) {
        checked.add(strCoordinate)
        queue.push(strCoordinate)
      }
    }
  }

  tiles = nextGen
}

console.log(`B: ${countFlipped(tiles)}`)
