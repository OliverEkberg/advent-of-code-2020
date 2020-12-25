const fs = require('fs')
const [rulesSection, [, myTicket], nearbyTicketsSection] = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')
  .map(section => section.split('\n'))

const fieldRx = /(.+): /
const rangeRx = / ([0-9]+)-([0-9]+)/g

nearbyTicketsSection.shift() // First line is just a separator
const nearbyTickets = nearbyTicketsSection

const ruleMap = new Map()

for (const rule of rulesSection) {
  const [, field] = rule.match(fieldRx)
  const okValues = new Set()

  const rangeMatches = rule.matchAll(rangeRx)
  for (const [, min, max] of rangeMatches) {
    for (let k = Number(min); k <= Number(max); k++) okValues.add(k)
  }

  ruleMap.set(field, okValues)
}

const intersect = (setA, setB) => {
  const ret = new Set()
  for (const el of setA) {
    if (setB.has(el)) ret.add(el)
  }
  return ret
}

const getPassingRules = (value) => {
  const passing = []
  for (const [rule, okValues] of ruleMap) {
    if (okValues.has(value)) {
      passing.push(rule)
    }
  }

  return passing
}

const matchesAnyRule = value => getPassingRules(value).length > 0

const validTickets = nearbyTickets
  .map(ticket => ticket.split(',').map(Number))
  .filter(ticket => ticket.every(matchesAnyRule))

const columns = []
for (let col = 0; col < validTickets[0].length; col++) {
  columns.push([])

  for (let row = 0; row < validTickets.length; row++) {
    columns[col].push(validTickets[row][col])
  }
}

const ruleColumnsMap = new Map()

for (let i = 0; i < columns.length; i++) {
  const column = columns[i]
  let passingRules = new Set()

  for (const value of column) {
    if (passingRules.size === 0) {
      passingRules = new Set(getPassingRules(value))
    } else {
      const currentPassingRules = new Set(getPassingRules(value))
      passingRules = intersect(passingRules, currentPassingRules)
    }
  }

  for (const passingRule of passingRules) {
    if (!ruleColumnsMap.has(passingRule)) {
      ruleColumnsMap.set(passingRule, new Set())
    }

    ruleColumnsMap.get(passingRule).add(i)
  }
}

const finalRuleColumnMap = new Map()

while (ruleColumnsMap.size) {
  let rule
  let columnId

  for (const [currentRule, columnIds] of ruleColumnsMap) {
    if (columnIds.size === 1) {
      rule = currentRule
      columnId = [...columnIds][0] // Extract one and only entry from set
      break
    }
  }

  ruleColumnsMap.delete(rule)

  // Remove columnId from as potential match for other columns
  for (const [, columnIds] of ruleColumnsMap) {
    columnIds.delete(columnId)
  }

  finalRuleColumnMap.set(rule, columnId)
}

const myTickerArr = myTicket.split(',').map(Number)

let total = 1

for (const [rule, columnId] of finalRuleColumnMap) {
  if (rule.includes('departure')) {
    total *= myTickerArr[columnId]
  }
}

console.log(total)
