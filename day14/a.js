const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const maskRx = /mask = ([X10]{36})/
const instructionRx = /mem\[([0-9]+)] = ([0-9]+)/

const memory = new Map()

for (let i = 0; i < data.length - 1; i++) {
  const [, maskStr] = data[i].match(maskRx)
  const mask = maskStr.split('')

  while (i + 1 < data.length && !data[i + 1].includes('mask')) {
    i++
    let [, addr, val] = data[i].match(instructionRx)
    addr = Number(addr)
    val = Number(val)

    const binaryArray = val
      .toString(2)
      .padStart(36, '0')
      .split('')

    for (let j = 0; j < mask.length; j++) {
      if (mask[j] !== 'X') {
        binaryArray[j] = mask[j]
      }
    }

    const baseTenVal = parseInt(binaryArray.join(''), 2)
    memory.set(addr, baseTenVal)
  }
}

let acc = 0
for (const [, val] of memory) {
  acc += val
}

console.log(acc)
