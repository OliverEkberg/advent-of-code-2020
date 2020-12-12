const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const rx = /(N|S|E|W|L|R|F)(\d+)/

let x = 0
let y = 0
let dx = 1
let dy = 0

const moveClicks = (c, dir) => {
  for (let i = 0; i < c; i++) {
    const oldDx = dx
    dx = dy * dir
    dy = -oldDx * dir
  }
}

for (const row of data) {
  const [, action, number] = row.match(rx)
  const value = Number(number)

  switch (action) {
    case 'N':
      y += value
      break
    case 'S':
      y -= value
      break
    case 'E':
      x += value
      break
    case 'W':
      x -= value
      break
    case 'L':
      moveClicks((value / 90) % 4, -1)
      break
    case 'R':
      moveClicks((value / 90) % 4, 1)
      break
    case 'F':
      x += dx * value
      y += dy * value
      break
  }
}

console.log(Math.abs(x) + Math.abs(y))
