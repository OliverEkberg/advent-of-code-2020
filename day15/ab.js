const startingNumbers = '17,1,3,16,19,0'.split(',').map(Number)

const numTurns = 30000000 // Change this to 2020 in order to run part 1
const numbers = new Map()

let turn = 1

// Add starting numbers
for (const startingNumber of startingNumbers) {
  numbers.set(startingNumber, [turn])
  turn++
}

let lastSpoken = startingNumbers.pop()
while (turn <= numTurns) {
  const recentlySpokenPrevious = numbers.get(lastSpoken)

  // Handle number spoken in previous turn
  if (recentlySpokenPrevious.length === 1) {
    lastSpoken = 0
  } else {
    lastSpoken = recentlySpokenPrevious[1] - recentlySpokenPrevious[0]
  }

  // Handle number spoken in current turn
  let recentlySpokenCurrent = numbers.get(lastSpoken)
  if (!recentlySpokenCurrent) {
    recentlySpokenCurrent = []
    numbers.set(lastSpoken, recentlySpokenCurrent)
  }
  recentlySpokenCurrent.push(turn)

  // Only keep the two most recent turns
  if (recentlySpokenCurrent.length > 2) {
    recentlySpokenCurrent.shift()
  }

  turn++
}

console.log(lastSpoken)
