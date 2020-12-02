const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const numValid = data.reduce((acc, curr) => {
  const [rule, password] = curr.split(':').map(s => s.trim())
  const [range, letter] = rule.split(' ')
  const [idx1, idx2] = range.split('-').map(Number)

  const charsOfInterest = new Set([
    password.charAt(idx1 - 1),
    password.charAt(idx2 - 1)
  ])
  return charsOfInterest.has(letter) && charsOfInterest.size === 2 ? acc + 1 : acc
}, 0)

console.log(numValid)
