const fs = require('fs')
let [, busIds] = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

busIds = busIds.split(',')

const map = new Map()
for (let i = 0; i < busIds.length; i++) {
  if (busIds[i] !== 'x') {
    map.set(i, Number(busIds[i]))
  }
}

let stepSize = 1
let iterationsCutoff = 1
let firstTime = 0

for (const [busOffset, busId] of map) {
  iterationsCutoff *= busId

  for (let i = firstTime; i < iterationsCutoff; i += stepSize) {
    if ((i + busOffset) % busId !== 0) continue

    firstTime = i
    stepSize *= busId
    break
  }
}

console.log(firstTime)
