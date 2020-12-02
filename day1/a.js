const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(Number)

const foundValues = new Set()
const desiredSum = 2020

for (const val of data) {
  if (foundValues.has(desiredSum - val)) {
    console.log(val, desiredSum - val, val * (desiredSum - val))
    break
  }
  foundValues.add(val)
}
