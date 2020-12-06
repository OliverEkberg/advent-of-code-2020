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
  const answerSets = []

  // Structure group data in sets for faster computation later
  for (const answer of group) {
    const set = new Set()

    for (const char of answer) {
      uniqueQuestions.add(char)
      set.add(char)
    }

    answerSets.push(set)
  }

  let matchesInGroup = 0
  for (const uniqueQuestion of uniqueQuestions) {
    const allAnswered = answerSets.every(set => set.has(uniqueQuestion))

    if (allAnswered) {
      matchesInGroup++
    }
  }

  sum += matchesInGroup
}

console.log(sum)
