const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(Number)

const preamble = 25

// key => a value form the input. value => indices (relative to input data) where given value was found
const values = new Map()

for (let i = 0; i < data.length; i++) {
  let idxs = values.get(data[i])
  if (!idxs) {
    idxs = []
    values.set(data[i], idxs)
  }
  idxs.push(i)
}

for (let i = preamble; i < data.length; i++) {
  const candidate = data[i]

  let found = false
  const lower = i - preamble // Micro-optimization, but why not? Less duplication too!

  // Check preamble st values back
  outer:
  for (let j = lower; j < i; j++) {
    const complement = values.get(candidate - data[j])

    // Check if complement exist
    if (complement) {
      // Check if complement actually are within the ok range (lower <= index < i)
      for (let k = 0; k < complement.length; k++) {
        if (complement[k] < i && complement[k] >= lower) {
          found = true
          break outer
        }
      }
    }
  }

  if (!found) {
    console.log(candidate)
    break
  }
}
