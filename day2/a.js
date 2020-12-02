const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const numValid = data.reduce((acc, curr) => {
  const [rule, password] = curr.split(':').map(s => s.trim())
  const [range, letter] = rule.split(' ')
  const [rangeStart, rangeEnd] = range.split('-').map(Number)

  let matches = 0
  for (let i = 0; i < password.length; i++) {
    if (password.charAt(i) === letter) {
      matches++
    }
  }

  return matches >= rangeStart && matches <= rangeEnd ? acc + 1 : acc
}, 0)

console.log(numValid)
