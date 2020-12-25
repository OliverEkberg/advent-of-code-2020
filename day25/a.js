const fs = require('fs')
const [cardPublicKey, doorPublicKey] = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(Number)

const divider = 20201227

const findLoopSize = (subjectNumber, publicKey) => {
  let loopSize = 0

  let value = 1
  while (true) {
    loopSize++
    value *= subjectNumber
    value %= divider

    if (publicKey === value) break
  }

  return loopSize
}

const computeKey = (subjectNumber, loopSize) => {
  let key = 1

  for (let i = 0; i < loopSize; i++) {
    key *= subjectNumber
    key %= divider
  }

  return key
}

const cardLoopSize = findLoopSize(7, cardPublicKey)
const key = computeKey(doorPublicKey, cardLoopSize)

console.log(key)
