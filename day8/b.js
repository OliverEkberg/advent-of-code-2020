const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')
const r = /(nop|acc|jmp) ([+-]\d+)/

const instructions = []
for (const row of data) {
  const [, operation, number] = row.match(r)
  const instruction = [operation, Number(number)]
  instructions.push(instruction)
}

const runProgram = (instructions) => {
  let acc = 0
  let pc = 0
  const executedRows = new Set()
  while (true) {
    // Reached the end of the program
    if (pc >= instructions.length) {
      return [true, acc]
    }

    // Reached an already executed instruction => infinite loop
    if (executedRows.has(pc)) {
      return [false, acc]
    }

    executedRows.add(pc)

    const [operation, arg] = instructions[pc]
    switch (operation) {
      case 'nop':
        pc++
        break
      case 'acc':
        acc = acc + arg
        pc++
        break
      case 'jmp':
        pc = pc + arg
        break
    }
  }
}

for (let j = 0; j < instructions.length; j++) {
  // acc instructions should be ignored
  if (instructions[j][0] === 'acc') continue

  const save = instructions[j][0]

  // Invert. nop => jmp, jmp => nop
  instructions[j][0] = save === 'nop' ? 'jmp' : 'nop'

  const [success, acc] = runProgram(instructions)
  if (success) {
    console.log(acc)
    break
  }

  // Restore changed instruction for next iteration
  instructions[j][0] = save
}
