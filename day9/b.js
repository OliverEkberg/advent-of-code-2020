const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(Number)

const lookingFor = 731031916 // Computed as solution to part A

// key => sum of current el and all previous. value => index of current el
const sums = new Map()
let prev = 0
for (let i = 0; i < data.length; i++) {
  const current = prev + data[i]
  sums.set(current, i)
  prev = current
}

let offset = 0
for (let i = 0; i < data.length; i++) {
  const lastIdx = sums.get(lookingFor + offset)

  // Found the sum
  if (lastIdx) {
    let currSum = 0
    let min = Infinity
    let max = -Infinity

    // Backtrack until the whole sum is covered in order to find smallest and largest element
    for (let j = lastIdx; currSum !== lookingFor; j--) {
      if (data[j] > max) max = data[j]
      if (data[j] < min) min = data[j]
      currSum += data[j]
    }

    console.log(min + max)
    break
  }

  // Instead of updating all keys in the map (inefficient) we just offset the key used in next iteration
  offset += data[i]
}
