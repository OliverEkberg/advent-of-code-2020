const fs = require('fs')
const players = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')

const playerCards = []

for (const player of players) {
  const [, ...cards] = player.split('\n').map(Number)
  playerCards.push(cards)
}

const copyN = (arr, n) => {
  const tmp = []
  for (let i = 0; i < n; i++) {
    tmp.push(arr[i])
  }
  return tmp
}

const playGame = (p1, p2) => {
  const pr = new Set()
  const pc = [p1, p2]
  while (!(pc.some(c => c.length === 0))) {
    const key = pc[0].join(',') + '-' + pc[1].join(',')
    if (pr.has(key)) {
      return true
    } else {
      pr.add(key)
    }

    const a = pc[0].shift()
    const b = pc[1].shift()

    let aWinner = false
    if (pc[0].length >= a && pc[1].length >= b) {
      aWinner = playGame(
        copyN(pc[0], a),
        copyN(pc[1], b)
      )
    } else {
      aWinner = a > b
    }

    if (aWinner) {
      pc[0].push(a, b)
    } else {
      pc[1].push(b, a)
    }
  }

  return pc[0].length > 0
}

playGame(playerCards[0], playerCards[1])

let factor = 1
let sum = 0

const winnerCards = playerCards.find(a => a.length !== 0)
for (const card of winnerCards.reverse()) {
  sum += card * factor
  factor++
}

console.log(sum)
