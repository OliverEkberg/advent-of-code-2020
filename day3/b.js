const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
]
const tree = '#'
const mapWidth = data[0].length

const slopeResults = slopes.reduce((acc, [right, down]) => {
  let encounteredTrees = 0

  let x = 0
  let y = 0
  while (y < data.length - down) {
    x += right
    y += down

    if (data[y].charAt(x % mapWidth) === tree) {
      encounteredTrees++
    }
  }

  acc.push(encounteredTrees)
  return acc
}, [])

console.log(
  slopeResults.reduce((product, num) => product * num, 1)
)
