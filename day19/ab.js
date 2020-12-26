const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const rules = new Map()
const messages = []

const ruleRx = /(\d+): (.*)/

for (const row of data) {
  const match = row.match(ruleRx)

  if (match) {
    const [, ruleId, ruleStr] = match

    let rule
    if (ruleStr.includes('"')) {
      rule = ruleStr[1] // The wanted char is directly surrounded by quotes
    } else {
      const ors = ruleStr.split(' | ')
      rule = ors.map(or => {
        return or.split(' ').map(Number)
      })
    }

    rules.set(Number(ruleId), rule)
  } else {
    if (row.length > 0) {
      messages.push(row)
    }
  }
}

// These two rows are the only difference between part A and B. Comment them out if running part A.
rules.set(8, [[42], [42, 8]])
rules.set(11, [[42, 31], [42, 11, 31]])

const recurse = (message, toCheck = [0], ruleId = 0) => {
  if (toCheck.length === 0) return []
  const condition = rules.get(ruleId)

  const returnIndices = []
  if (Array.isArray(condition)) {
    for (const ruleIds of condition) {
      let toCheckNow = toCheck

      for (const ruleId of ruleIds) {
        toCheckNow = recurse(message, toCheckNow, ruleId)
      }

      returnIndices.push(...toCheckNow)
    }
  } else {
    for (const index of toCheck) {
      if (message[index] === condition) {
        returnIndices.push(index + 1)
      }
    }
  }

  return returnIndices
}

const isValid = (message) => {
  return recurse(message)
    .some(idx => idx === message.length)
}

const validMessages = messages.filter(message => isValid(message))
console.log(validMessages.length)
