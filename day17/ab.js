const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const toStr = (coord) => coord.join(',')
const fromStr = (sCoord) => sCoord.split(',').map(Number)

let coordinates = new Map()

const nDimensions = 4 // Change this to 3 in order to run part A

for (let y = 0; y < data.length; y++) {
  const row = data[y].split('')

  for (let x = 0; x < row.length; x++) {
    const coord = [x, y]

    // Convert 2d coordinatiate to selected dimension
    while (coord.length < nDimensions) {
      coord.push(0)
    }

    coordinates.set(toStr(coord), row[x] === '#')
  }
}

const getValue = (coord) => {
  const key = toStr(coord)
  return !!coordinates.get(key)
}

const equals = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

const nextValue = (coord) => {
  const key = toStr(coord)

  let toCheck = [[]]

  // Loop through all dimensions and add all adjacent coordinates successively
  for (const c of coord) {
    const tmp = []

    for (const curr of toCheck) {
      for (let i = c - 1; i <= c + 1; i++) {
        tmp.push([...curr, i])
      }
    }

    toCheck = tmp
  }

  let numActive = 0

  const adjacent = []
  const isActive = coordinates.get(key)

  for (const c of toCheck) {
    if (equals(c, coord)) continue
    if (getValue(c)) numActive++
    adjacent.push(toStr(c))
  }

  if (isActive) {
    return [[2, 3].includes(numActive), adjacent]
  } else {
    if (numActive === 0) return [false, []] // In order to not check in all eternity
    return [numActive === 3, adjacent]
  }
}

const doCycle = () => {
  const queue = [...coordinates.keys()]
  const addedBefore = new Set(queue)

  const nextGen = new Map()
  while (queue.length) {
    const currCoordStr = queue.pop()
    const [nextVal, toVisit] = nextValue(fromStr(currCoordStr))

    // Only add active coordinates to next generation (others are considered inactive anyways)
    if (nextVal) {
      nextGen.set(currCoordStr, nextVal)
    }

    // Add neighbours to queue
    for (const candidate of toVisit) {
      if (!addedBefore.has(candidate)) {
        addedBefore.add(candidate)
        queue.push(candidate)
      }
    }
  }

  coordinates = nextGen
}

for (let i = 0; i < 6; i++) {
  doCycle()
}

console.log(coordinates.size)
