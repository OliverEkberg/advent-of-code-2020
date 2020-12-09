const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const bagMap = new Map()
const parentRx = /(\w+ \w+) bags contain/
const childRx = /(\d+) (\w+ \w+) bag[s]?[,.]/g

for (const row of data) {
  const [, bagColour] = row.match(parentRx)
  const childMatches = row.matchAll(childRx)
  const bagsInside = new Set()
  for (const [,, colour] of childMatches) {
    bagsInside.add(colour)
  }

  bagMap.set(bagColour, bagsInside)
}

const memoize = new Map()

const recurse = (target, bagColour) => {
  // Base case. We do not want to compute values more than once
  if (memoize.has(bagColour)) return memoize.get(bagColour)

  // Another base case
  const bags = bagMap.get(bagColour)
  if (!bags) return false

  // If the current bag directly contains the target
  if (bags.has(target)) {
    memoize.set(bagColour, true)
    return true
  } else {
    // Check children recursively
    for (const colour of bags) {
      if (recurse(target, colour)) {
        memoize.set(bagColour, true)
        return true
      }
    }

    memoize.set(bagColour, false)
    return false
  }
}

const target = 'shiny gold'
let num = 0
for (const [colour] of bagMap) {
  if (recurse(target, colour)) {
    num++
  }
}
console.log(num)
