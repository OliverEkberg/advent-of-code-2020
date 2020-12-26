const input = '362981754'
const maxValue = 1000000 // Change this to 9 in order to run part A
const iterations = 10000000 // Change this to 100 in order to run part A
const cups = input.split('').map(Number)

for (let i = 10; i <= maxValue; i++) {
  cups.push(i)
}

const buildLinkedList = (arr) => {
  let head = null
  let prev = null
  for (const entry of arr) {
    const link = {
      value: entry,
      next: null
    }

    if (prev) prev.next = link
    if (!head) head = link
    prev = link
  }

  // Link head with end to complete circular list
  prev.next = head

  return head
}

const linkedListToArray = (head, length) => {
  const arr = []

  let curr = head
  for (let i = 0; i < length; i++) {
    arr.push(curr.value)
    curr = curr.next
  }

  return arr
}

const getNextVal = (from, maxVal) => {
  const notOkValues = linkedListToArray(from.next, 3)

  let currentValue = from.value
  let found = null
  while (!found) {
    currentValue--
    if (currentValue <= 0) {
      currentValue = maxVal
    }

    if (!notOkValues.includes(currentValue)) found = true
  }

  return currentValue
}

const head = buildLinkedList(cups)

const lookupTable = new Map()

// Build lookup table
let tmp = head
do {
  lookupTable.set(tmp.value, tmp)
  tmp = tmp.next
} while (tmp !== head)

let from = head
for (let i = 0; i < iterations; i++) {
  const to = lookupTable.get(getNextVal(from, maxValue))

  let end = from
  for (let i = 0; i < 3; i++) {
    end = end.next
  }

  // Relink the list
  const fromNext = from.next
  const toNext = to.next
  from.next = end.next
  end.next = toNext
  to.next = fromNext

  // For next interation
  from = from.next
}

const one = lookupTable.get(1)
const partA = linkedListToArray(one.next, 8).join('')
const partB = one.next.value * one.next.next.value

console.log(`A: ${partA}`)
console.log(`B: ${partB}`)
