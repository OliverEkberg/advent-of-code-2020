const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(str => Number(str))

const target = 0
data.push(target)

const map = new Map()
let max = -Infinity

for (const currVal of data) {
  if (currVal > max) max = currVal
  map.set(currVal, [])
}

for (const currVal of data) {
  // Check all values that could link to current value (data[i] > val >= data[i] - 3)
  for (let candidateVal = currVal - 1; candidateVal > currVal - 4; candidateVal--) {
    if (!map.has(candidateVal)) continue // Value must be part of input dataset
    map.get(currVal).push(candidateVal)
  }
}

const memoize = new Map()
const recurse = (val) => {
  // Base case 1: Value already computed
  if (memoize.has(val)) return memoize.get(val)

  // Base case 2: Value does not exist in input
  if (!map.has(val)) {
    memoize.set(val, 0)
    return 0
  }

  const links = map.get(val)

  let count = 0
  for (const link of links) {
    if (link === target) {
      count++
    } else {
      count += recurse(link)
    }
  }

  memoize.set(val, count)
  return count
}

console.log(recurse(max))
