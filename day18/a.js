const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const opRegex = /\d+ [+*]{1} \d+/g

// Evaluates an expression without nested parentheses
const evaluate = (expression) => {
  let tmp = expression
    .replace('(', '')
    .replace(')', '')

  let match = tmp.match(opRegex)
  while (match) {
    const [firstMatch] = match
    tmp = tmp.replace(firstMatch, eval(firstMatch))
    match = tmp.match(opRegex)
  }

  return Number(tmp)
}

const enclosedExprRegex = /\([\d+* ]+\)/g
const evaluateInOrder = (expr) => {
  let currExpr = expr

  let match = currExpr.match(enclosedExprRegex)
  while (match) {
    currExpr = currExpr.replace(match[0], evaluate(match[0]))
    match = currExpr.match(enclosedExprRegex)
  }

  return evaluate(currExpr)
}

let sum = 0
for (const row of data) {
  sum += evaluateInOrder(row)
}

console.log(sum)
