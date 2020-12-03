const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')
const right = 3
const down = 1
const tree = '#'
const mapWidth = data[0].length

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

console.log(encounteredTrees)
