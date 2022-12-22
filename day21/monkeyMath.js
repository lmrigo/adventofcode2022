var input = [
`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`
 ,puzzleInput
]

var monkeys

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var monkeyStrings = input[i].split(/\n+/)
    monkeyStrings.sort()
    // console.log(monkeyStrings)
    monkeys = {}
    $.each(monkeyStrings,(idx,monStr)=>{
      var splitted = monStr.split(/\:?\s+/)
      const name = splitted[0]
      monkeys[name] = {}
      if (splitted.length > 2) {
        monkeys[name].left = splitted[1]
        monkeys[name].op = splitted[2]
        monkeys[name].right = splitted[3]
      } else {
        monkeys[name].val = Number(splitted[1])
      }
    })
    // console.log(monkeys)

    const result = calculateMonkeys('root')
    // 38731621732448
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var calculateMonkeys = function(name) {
  var value
  if (monkeys[name].val !== undefined) {
    value = monkeys[name].val
  } else {
    var value
    var leftVal = calculateMonkeys(monkeys[name].left)
    var rightVal = calculateMonkeys(monkeys[name].right)
    if (monkeys[name].op === '+') {
      value = leftVal + rightVal
    } else if (monkeys[name].op === '-') {
      value = leftVal - rightVal
    } else if (monkeys[name].op === '*') {
      value = leftVal * rightVal
    } else if (monkeys[name].op === '/') {
      value = leftVal / rightVal
    } else if (monkeys[name].op === '=') {
      console.log(leftVal,rightVal)
      value = leftVal === rightVal
    }
  }
  return value
}

var calculateMonkeysRetRight = function(name) {
  var value
  if (monkeys[name].val !== undefined) {
    value = monkeys[name].val
  } else {
    var value
    var leftVal = calculateMonkeys(monkeys[name].left)
    var rightVal = calculateMonkeys(monkeys[name].right)
    if (monkeys[name].op === '+') {
      value = leftVal + rightVal
    } else if (monkeys[name].op === '-') {
      value = leftVal - rightVal
    } else if (monkeys[name].op === '*') {
      value = leftVal * rightVal
    } else if (monkeys[name].op === '/') {
      value = leftVal / rightVal
    } else if (monkeys[name].op === '=') {
      value = rightVal
    }
  }
  return value
}


var calculateMonkeysRetLeft = function(name) {
  var value
  if (monkeys[name].val !== undefined) {
    value = monkeys[name].val
  } else {
    var value
    var leftVal = calculateMonkeys(monkeys[name].left)
    var rightVal = calculateMonkeys(monkeys[name].right)
    if (monkeys[name].op === '+') {
      value = leftVal + rightVal
    } else if (monkeys[name].op === '-') {
      value = leftVal - rightVal
    } else if (monkeys[name].op === '*') {
      value = leftVal * rightVal
    } else if (monkeys[name].op === '/') {
      value = leftVal / rightVal
    } else if (monkeys[name].op === '=') {
      value = leftVal
    }
  }
  return value
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var monkeyStrings = input[i].split(/\n+/)
    monkeyStrings.sort()
    // console.log(monkeyStrings)
    monkeys = {}
    $.each(monkeyStrings,(idx,monStr)=>{
      var splitted = monStr.split(/\:?\s+/)
      const name = splitted[0]
      monkeys[name] = {}
      if (splitted.length > 2) {
        monkeys[name].left = splitted[1]
        monkeys[name].op = splitted[2]
        monkeys[name].right = splitted[3]
      } else {
        monkeys[name].val = Number(splitted[1])
      }
    })
    // console.log(monkeys)

    monkeys['root'].op = '='

    const inverse = i!==0
    const rightTarget = calculateMonkeysRetRight('root')
    var humnVal = rightTarget
    var equal = false
    var timeout = 100
    var curr = calculateMonkeysRetLeft('root')
    var factor = humnVal
    var prevSmaller = (rightTarget-curr) > 0
    var currSmaller = (rightTarget-curr) > 0
    while (timeout-- > 0 && !equal) {
      monkeys['humn'].val = humnVal
      curr = calculateMonkeysRetLeft('root')
      equal = curr === rightTarget
      // console.log(humnVal+': '+curr+'|'+rightTarget+' = '+(rightTarget-curr))
      if (!equal) {
        if (!inverse) {
          currSmaller = (rightTarget-curr) > 0
          if (prevSmaller && !currSmaller) {
            factor = Math.floor(factor/2)
            humnVal -= factor
          } else if (prevSmaller && currSmaller) {
            humnVal += factor
          } else if (!prevSmaller && currSmaller) {
            factor = Math.floor(factor/2)
            humnVal += factor
          } else if (!prevSmaller && !currSmaller) {
            humnVal -= factor
          }
          prevSmaller = currSmaller
        } else {
          currSmaller = (rightTarget-curr) > 0
          if (prevSmaller && !currSmaller) {
            factor = Math.floor(factor/2)
            humnVal += factor
          } else if (prevSmaller && currSmaller) {
            humnVal -= factor
          } else if (!prevSmaller && currSmaller) {
            factor = Math.floor(factor/2)
            humnVal -= factor
          } else if (!prevSmaller && !currSmaller) {
            humnVal += factor
          }
          prevSmaller = currSmaller
        }
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
    }

    const result = humnVal
    // 3848301405790
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
