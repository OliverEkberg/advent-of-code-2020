const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const bagMap = new Map()
const parentRx = /(\w+ \w+) bags contain/
const childRx = /(\d+) (\w+ \w+) bag[s]?[,.]/g

for (const row of data) {
  const [, bagColour] = row.match(parentRx)
  const childMatches = row.matchAll(childRx)
  const bagsInside = []
  for (const [, num, colour] of childMatches) {
    bagsInside.push([Number(num), colour])
  }

  bagMap.set(bagColour, bagsInside)
}

const memoize = new Map()

const recurse = (bagColour) => {
  // Base case. We do not want to compute values more than once
  if (memoize.has(bagColour)) return memoize.get(bagColour)

  // Another base case
  const bags = bagMap.get(bagColour)
  if (!bags) return 0

  let sum = 0
  for (const [num, colour] of bags) {
    sum += num
    sum += num * recurse(colour)
  }

  memoize.set(bagColour, sum)
  return sum
}

const target = 'shiny gold'
const num = recurse(target)
console.log(num)
