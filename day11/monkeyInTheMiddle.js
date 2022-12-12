var input = [
`Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`
 ,puzzleInput
]

function Monkey (items,operation,test) {
  this.items = items,
  this.operation = operation,
  this.test = test,
  this.inspections = 0
}


var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var inputStrings = input[i].split(/\n+/)

    var monkeys = []
    for (var j = 0; j < inputStrings.length; j+=6) {
      // Monkey #
      var str = inputStrings[j].split(/\s+/)
      const mIdx = Number(str[1].replaceAll(':',''))
      // Items
      str = inputStrings[j+1].replaceAll(',','').trim().split(/\s+/)
      var items = []
      for (var k = 2; k < str.length; k++) {
        items.push(Number(str[k]))
      }
      // Operation
      str = inputStrings[j+2].trim().split(/\s+/)
      var operation
      const p1 = Number(str[3])
      const op = str[4]
      const p2 = Number(str[5])
      if (Number.isNaN(p1)) { // p1 = old
        if (Number.isNaN(p2)) { // p2 = old
          if (op === '+') {
            operation = (old) => {return old + old}
          } else { // *
            operation = (old) => {return old * old}
          }
        } else {
          if (op === '+') {
            operation = (old) => {return old + p2}
          } else { // *
            operation = (old) => {return old * p2}
          }
        }
      } else {
        if (Number.isNaN(p2)) { // p2 = old
          if (op === '+') {
            operation = (old) => {return p1 + old}
          } else { // *
            operation = (old) => {return p1 * old}
          }
        } else {
          if (op === '+') {
            operation = () => {return p1 + p2}
          } else { // *
            operation = () => {return p1 * p2}
          }
        }
      }
      // Test
      str = inputStrings[j+3].trim().split(/\s+/)
      const divisibleBy = Number(str[3])
      // If True
      str = inputStrings[j+4].trim().split(/\s+/)
      const trueMonkeyIdx = Number(str[5])
      // If False
      str = inputStrings[j+5].trim().split(/\s+/)
      const falseMonkeyIdx = Number(str[5])
      const testOp = (x) => {return (x % divisibleBy === 0) ? trueMonkeyIdx : falseMonkeyIdx}

      monkeys[mIdx] = new Monkey(items, operation, testOp)
    }
    // console.log(monkeys)

    const maxRounds = 20
    var round = 0
    while(round++ < maxRounds) {
      for (var m = 0; m < monkeys.length; m++) {
        var mon = monkeys[m]
        $.each(mon.items,(idx,item) => {
          var holding = mon.operation(item)
          mon.inspections++
          holding = Math.floor(holding/3)
          const targetIdx = mon.test(holding)
          monkeys[targetIdx].items.push(holding)
        })
        mon.items = []
      }
    }

    // printItems(monkeys)
    // printInspections(monkeys)

    var inspections = $.map(monkeys,(m)=>{return m.inspections})
    inspections.sort((a,b)=>{return b-a})
    // console.log(inspections)
    const monkeyBusiness = inspections[0] * inspections[1]

    const result = monkeyBusiness
    // 56350
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var printItems = function(monkeys) {
  var str = ''
  for (var i = 0; i < monkeys.length; i++) {
    str += 'Monkey ' + i
    for (var j = 0; j < monkeys[i].items.length; j++) {
      str += ' ' + monkeys[i].items[j] + ','
    }
    str += '\n'
  }
  console.log(str)
}

var printInspections = function(monkeys) {
  var str = ''
  for (var i = 0; i < monkeys.length; i++) {
    str += 'Monkey ' + i + ' inspected items '
    + monkeys[i].inspections + ' times.\n'
  }
  console.log(str)
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var inputStrings = input[i].split(/\n+/)

    var monkeys = []
    var commonDivisor = 1
    for (var j = 0; j < inputStrings.length; j+=6) {
      // Monkey #
      var str = inputStrings[j].split(/\s+/)
      const mIdx = Number(str[1].replaceAll(':',''))
      // Items
      str = inputStrings[j+1].replaceAll(',','').trim().split(/\s+/)
      var items = []
      for (var k = 2; k < str.length; k++) {
        items.push(Number(str[k]))
      }
      // Operation
      str = inputStrings[j+2].trim().split(/\s+/)
      var operation
      const p1 = Number(str[3])
      const op = str[4]
      const p2 = Number(str[5])
      if (Number.isNaN(p1)) { // p1 = old
        if (Number.isNaN(p2)) { // p2 = old
          if (op === '+') {
            operation = (old) => {return old + old}
          } else { // *
            operation = (old) => {return old * old}
          }
        } else {
          if (op === '+') {
            operation = (old) => {return old + p2}
          } else { // *
            operation = (old) => {return old * p2}
          }
        }
      } else {
        if (Number.isNaN(p2)) { // p2 = old
          if (op === '+') {
            operation = (old) => {return p1 + old}
          } else { // *
            operation = (old) => {return p1 * old}
          }
        } else {
          if (op === '+') {
            operation = () => {return p1 + p2}
          } else { // *
            operation = () => {return p1 * p2}
          }
        }
      }
      // Test
      str = inputStrings[j+3].trim().split(/\s+/)
      const divisibleBy = Number(str[3])
      // If True
      str = inputStrings[j+4].trim().split(/\s+/)
      const trueMonkeyIdx = Number(str[5])
      // If False
      str = inputStrings[j+5].trim().split(/\s+/)
      const falseMonkeyIdx = Number(str[5])
      const testOp = (x) => {return (x % divisibleBy === 0) ? trueMonkeyIdx : falseMonkeyIdx}

      monkeys[mIdx] = new Monkey(items, operation, testOp)
      // multiply all divisibleBy and use as the 3 of the previous part
      commonDivisor *= divisibleBy
    }
    // console.log(monkeys)

    const maxRounds = 10000
    var round = 0
    while(round++ < maxRounds) {
      for (var m = 0; m < monkeys.length; m++) {
        var mon = monkeys[m]
        $.each(mon.items,(idx,item) => {
          var holding = mon.operation(item)
          mon.inspections++
          holding = holding % commonDivisor
          const targetIdx = mon.test(holding)
          monkeys[targetIdx].items.push(holding)
        })
        mon.items = []
      }
    }

    // printItems(monkeys)
    // printInspections(monkeys)

    var inspections = $.map(monkeys,(m)=>{return m.inspections})
    inspections.sort((a,b)=>{return b-a})
    // console.log(inspections)
    const monkeyBusiness = inspections[0] * inspections[1]

    const result = monkeyBusiness
    // 13954061248
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
