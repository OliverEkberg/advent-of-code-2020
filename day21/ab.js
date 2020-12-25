const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const rx = /(.*) \(contains (.*)\)/

const intersect = (setA, setB) => {
  const common = new Set()
  for (const item of setA) {
    if (setB.has(item)) {
      common.add(item)
    }
  }

  return common
}

const allergenMap = new Map()
const totalIngredients = []

for (const row of data) {
  const [, ingredientsStr, allergenStr] = row.match(rx)
  const ingredients = ingredientsStr.split(' ')
  const allergens = allergenStr.split(', ')

  totalIngredients.push(...ingredients)

  for (const allergen of allergens) {
    if (!allergenMap.has(allergen)) {
      allergenMap.set(allergen, new Set(ingredients))
    } else {
      allergenMap.set(allergen, intersect(allergenMap.get(allergen), new Set(ingredients)))
    }
  }
}

const finalAllergens = new Map()

do {
  // Finding the smallest could be done more efficiently using a priority queue
  let smallestSize = Infinity
  let smallestAllergen = null

  for (const [allergen, ingredients] of allergenMap) {
    if (ingredients.size < smallestSize) {
      smallestSize = ingredients.size
      smallestAllergen = allergen
    }
  }

  const ingredient = [...allergenMap.get(smallestAllergen)][0] // Assume smallest is always just one

  finalAllergens.set(smallestAllergen, ingredient)
  allergenMap.delete(smallestAllergen)

  // Remove just found ingredient from other potential matches
  for (const [, ingredients] of allergenMap) {
    ingredients.delete(ingredient)
  }
} while (allergenMap.size > 0)

const allergenicIngredients = new Set([...finalAllergens.values()])

const nonAllergenticIngredients = totalIngredients.filter(ingredient => !allergenicIngredients.has(ingredient))

const sortedIngredients = [...finalAllergens.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, f]) => f)

console.log(`A: ${nonAllergenticIngredients.length}`)
console.log(`B: ${sortedIngredients.join(',')}`)
