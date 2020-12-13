const fs = require('fs')
let [startTime, busIds] = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

startTime = Number(startTime)
busIds = busIds
  .split(',')
  .filter(str => str !== 'x')
  .map(str => Number(str))

let min = Infinity
let bestBusId

for (const busId of busIds) {
  const earliestDepAfterStart = Math.ceil(startTime / busId) * busId

  if (earliestDepAfterStart < min) {
    min = earliestDepAfterStart
    bestBusId = busId
  }
}

console.log((min - startTime) * bestBusId)
