const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const rx = /(N|S|E|W|L|R|F)(\d+)/

let x = 0
let y = 0
let wx = 10
let wy = 1

const moveClicks = (c, dir) => {
  for (let i = 0; i < c; i++) {
    const oldWx = wx
    wx = wy * dir
    wy = -oldWx * dir
  }
}

for (const row of data) {
  const [, action, number] = row.match(rx)
  const value = Number(number)

  switch (action) {
    case 'N':
      wy += value
      break
    case 'S':
      wy -= value
      break
    case 'E':
      wx += value
      break
    case 'W':
      wx -= value
      break
    case 'L':
      moveClicks((value / 90) % 4, -1)
      break
    case 'R':
      moveClicks((value / 90) % 4, 1)
      break
    case 'F':
      x += wx * value
      y += wy * value
      break
  }
}

console.log(Math.abs(x) + Math.abs(y))
