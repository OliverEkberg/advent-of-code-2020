const data = require('./a.data')
const foundValues = new Set()

for (const val of data) {
  if (foundValues.has(2020 - val)) {
    console.log(val, 2020 - val, val * (2020 - val))
    break
  }
  foundValues.add(val)
}
