const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(str => Number(str))

const min = 0
const max = Math.max(...data) + 3

data.push(min, max)
const values = new Set(data)

const minDist = 1
const maxDist = 3
const differences = new Map([
  [minDist, 0],
  [maxDist, 0]
])

let curr = min
while (curr !== max) {
  for (let i = minDist; i <= maxDist; i++) {
    if (values.has(curr + i)) {
      differences.set(i, differences.get(i) + 1) // Increment num found at current difference
      curr = curr + i
      break
    }
  }
}

console.log(differences.get(minDist) * differences.get(maxDist))
