const data = require('./a.data')
const pairs = new Map()
const desiredSum = 2020

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data.length; j++) {
    if (j === i) continue
    pairs.set(data[i] + data[j], [data[i], data[j]])
  }
}

for (const val of data) {
  const found = pairs.get(desiredSum - val)
  if (found?.length === 2) {
    console.log(found[0], found[1], val, found[0] * found[1] * val)
    break
  }
}
