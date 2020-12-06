const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const groups = []

let i = 0
while (data[i]) {
  const group = []
  while (data[i] && data[i] !== ' ') {
    group.push(data[i])
    i++
  }

  groups.push(group)
  i++
}

let sum = 0

for (const group of groups) {
  const uniqueQuestions = new Set()

  for (const answer of group) {
    for (const char of answer) {
      uniqueQuestions.add(char)
    }
  }

  sum += uniqueQuestions.size
}

console.log(sum)
