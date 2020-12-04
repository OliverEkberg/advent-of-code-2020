const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const requirements = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid'
]

let numOkPassports = 0

for (let i = 0; i < data.length; i++) {
  const fields = new Set()

  while (data[i]) {
    data[i].split(' ').forEach(kv => {
      const [key] = kv.split(':')
      fields.add(key)
    })
    i++
  }

  const allRequirementsMet = requirements.every(key => fields.has(key))

  if (allRequirementsMet) {
    numOkPassports++
  }
}

console.log(numOkPassports)
