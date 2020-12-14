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

    const binaryArray = addr
      .toString(2)
      .padStart(36, '0')
      .split('')

    const floatingIdxs = []
    for (let j = 0; j < mask.length; j++) {
      switch (mask[j]) {
        case '1':
          binaryArray[j] = '1'
          break
        case 'X':
          floatingIdxs.push(j)
          break
      }
    }

    const combinations = floatingIdxs.length > 0 ? Math.pow(2, floatingIdxs.length) : 0

    for (let i = 0; i < combinations; i++) {
      const binaryStr = i
        .toString(2)
        .padStart(floatingIdxs.length, '0')

      for (let j = 0; j < binaryStr.length; j++) {
        const nextFloatingIdx = floatingIdxs[j]
        binaryArray[nextFloatingIdx] = binaryStr[j]
      }

      const baseTenAddr = parseInt(binaryArray.join(''), 2)
      memory.set(baseTenAddr, val)
    }
  }
}

let acc = 0
for (const [, val] of memory) {
  acc += val
}

console.log(acc)
