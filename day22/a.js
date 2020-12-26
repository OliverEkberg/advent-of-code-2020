const fs = require('fs')
const players = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')

const playerCards = []

for (const player of players) {
  const [, ...cards] = player.split('\n').map(Number)
  playerCards.push(cards)
}

while (!(playerCards.some(c => c.length === 0))) {
  const a = playerCards[0].shift()
  const b = playerCards[1].shift()

  if (a > b) {
    playerCards[0].push(a, b)
  } else {
    playerCards[1].push(b, a)
  }
}

let factor = 1
let sum = 0

const winnerCards = playerCards.find(a => a.length !== 0)
for (const card of winnerCards.reverse()) {
  sum += card * factor
  factor++
}

console.log(sum)
