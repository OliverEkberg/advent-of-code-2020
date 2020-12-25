const fs = require('fs')
const [rulesSection,, nearbyTicketsSection] = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')
  .map(section => section.split('\n'))

const fieldRx = /(.+): /
const rangeRx = / ([0-9]+)-([0-9]+)/g

const nearbyTickets = []
const ruleMap = new Map()

for (const rule of rulesSection) {
  const [, field] = rule.match(fieldRx)
  const ranges = []

  const rangeMatches = rule.matchAll(rangeRx)
  for (const [, min, max] of rangeMatches) {
    ranges.push([Number(min), Number(max)])
  }

  ruleMap.set(field, ranges)
}

nearbyTicketsSection.shift() // First line is just a separator
for (const nearbyTicket of nearbyTicketsSection) {
  nearbyTickets.push(nearbyTicket)
}

const matchesAnyRule = (value) => {
  for (const [, ranges] of ruleMap) {
    for (const [min, max] of ranges) {
      if (value >= min && value <= max) {
        return true
      }
    }
  }

  return false
}

const invalids = []

for (const ticket of nearbyTickets) {
  const values = ticket.split(',').map(Number)

  for (const value of values) {
    if (!matchesAnyRule(value)) {
      invalids.push(value)
      break
    }
  }
}

const sum = invalids.reduce((acc, curr) => acc + curr, 0)
console.log(sum)
