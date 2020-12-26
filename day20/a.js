const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')

const idRx = /Tile (\d+):/

const tileMap = new Map()

for (const row of data) {
  const [title, ...rest] = row.split('\n')
  const [, id] = title.match(idRx).map(Number)

  const tileSides = [
    '',
    '',
    '',
    ''
  ]

  tileSides[0] = rest[0]
  tileSides[2] = rest[rest.length - 1]
  for (let i = 0; i < rest.length; i++) {
    tileSides[1] = tileSides[1] + rest[i][rest[i].length - 1]
    tileSides[3] = tileSides[3] + rest[i][0]
  }

  tileMap.set(id, tileSides)
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

const cornerIds = []
for (const [id, patterns] of edgeMap) {
  if (patterns.length > 2) cornerIds.push(id)
}

console.log(
  cornerIds.reduce((acc, curr) => acc * curr, 1)
)
