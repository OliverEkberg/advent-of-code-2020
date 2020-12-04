const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const validateYear = (min, max, val) => {
  if (!/^\d{4}$/.test(val)) return false
  const num = Number(val)
  return num >= min && num <= max
}

const requirements = [
  ['byr', val => validateYear(1920, 2002, val)],
  ['iyr', val => validateYear(2010, 2020, val)],
  ['eyr', val => validateYear(2020, 2030, val)],
  ['hgt', val => {
    const matches = val.match(/^(\d+)(in|cm)$/)
    if (!matches) return false

    let [, digits, unit] = matches
    digits = Number(digits)

    return unit === 'in'
      ? digits >= 59 && digits <= 76
      : digits >= 150 && digits <= 193
  }],
  ['hcl', val => /^#[0-9a-f]{6}$/.test(val)],
  ['ecl', val => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val)],
  ['pid', val => /^\d{9}$/.test(val)]
]

let numOkPassports = 0

for (let i = 0; i < data.length; i++) {
  const fields = new Map()

  while (data[i]) {
    data[i].split(' ').forEach(kv => {
      const [key, value] = kv.split(':')
      fields.set(key, value)
    })
    i++
  }

  const allRequirementsMet = requirements.every(([key, validator]) => {
    const value = fields.get(key)
    return value && validator(value)
  })

  if (allRequirementsMet) {
    numOkPassports++
  }
}

console.log(numOkPassports)
