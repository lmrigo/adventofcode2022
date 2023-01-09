var input = [
`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`
 ,puzzleInput
]

var snafuToDecimal = function(strNumber) {
  var numArr = strNumber.split('').reverse()
  var decimal = 0
  for (var b = 0; b < numArr.length; b++) {
    var base = Math.pow(5,b)
    var num
    if (numArr[b] === '-') {
      num = -1
    } else if  (numArr[b] === '=') {
      num = -2
    } else {
      num = Number(numArr[b])
    }
    decimal += base * num
  }
  return decimal
}

var decimalToSnafu = function(number) {
  var counter = number
  var snafu = '0'
  while (counter-- > 0) { //TODO: works but it's very slow
    snafu = nextSnafu(snafu)
  }
  return snafu
}

var decimalToSnafu2 = function(number) {
  //12345
  //1-0---0
  var maxPow = 0
  while (Math.pow(5,maxPow) < number) {
    maxPow++
  }
  maxPow--
  var numRest = number - Math.pow(5,maxPow)
  var newSnafu = '1'
  while (maxPow-- > 0) {
    newSnafu += '0'
  }
  while (numRest-- > 0) {
    newSnafu = nextSnafu(newSnafu)
  }
  return newSnafu
}

var snafuSum = function(a, b) {
  var newSnafu = ''
  var carry = false
  var unCarry = false

  const lastA = a.charAt(a.length - 1)
  const lastB = b.charAt(b.length - 1)
  //todo: sum and carry
  newSnafu = digitSum[lastA+','+lastB]
  carry = carrySum[lastA+','+lastB]
  unCarry = unCarrySum[lastA+','+lastB]

  var ca = a.length - 2
  var cb = b.length - 2

  while (ca >= 0 || cb >= 0) {
    const charA = ca >= 0 ? a.charAt(ca) : '0'
    const charB = cb >= 0 ? b.charAt(cb) : '0'
    var temp = digitSum[charA+','+charB]
    if ((!carry && !unCarry) || (carry && unCarry)) {
      newSnafu = temp + newSnafu
      carry = carrySum[charA+','+charB]
      unCarry = unCarrySum[charA+','+charB]
    } else if (carry) {
      newSnafu = digitSum[temp+','+'1'] + newSnafu
      carry = carrySum[charA+','+charB]
      if (!carry) {
        carry = carrySum[temp+','+'1']
      }
      unCarry = unCarrySum[charA+','+charB]
    } else if (unCarry) {
      newSnafu = digitSum[temp+','+'-'] + newSnafu
      carry = carrySum[charA+','+charB]
      unCarry = unCarrySum[charA+','+charB]
      if (!unCarry) {
        unCarry = unCarrySum[temp+','+'-']
      }
    } else {
      console.log('should not happen!')
    }
    ca--
    cb--
  }
  if (carry || newSnafu.charAt(0) === '-' || newSnafu.charAt(0) === '=') {
    newSnafu = '1' + newSnafu
  }

  return newSnafu
}

var digitSum = {
  // 0
  '0,0': '0',
  '0,1': '1',
  '0,2': '2',
  '0,-': '-',
  '0,=': '=',
  // 1
  '1,0': '1',
  '1,1': '2',
  '1,2': '=', //c
  '1,=': '-',
  '1,-': '0',
  // 2
  '2,0': '2',
  '2,1': '=', //c
  '2,2': '-', //c
  '2,=': '0',
  '2,-': '1',
  // -
  '-,0': '-',
  '-,1': '0',
  '-,2': '1',
  '-,-': '=',
  '-,=': '2', //uc
  // =
  '=,0': '=',
  '=,1': '-',
  '=,2': '0',
  '=,-': '2', //uc
  '=,=': '1' //uc
}

var carrySum = {
  '1,2': true, //c
  '2,1': true, //c
  '2,2': true //c
}

var unCarrySum = {
  '-,=': true, //c
  '=,-': true, //c
  '=,=': true //c
}

var dec = [1,   2,  3,   4,   5,   6,   7,   8,   9,   10,  15,   20,   2022,    12345,    314159265]
var sna = ['1','2','1=','1-','10','11','12','2=','2-','20','1=0','1-0','1=11-2','1-0---0','1121-1110-1=0']


var nextSnafu = function(snafu) {
  var newSnafu = ''
  var carry = false

  const last = snafu.charAt(snafu.length - 1)
  if (last === '0') {
    newSnafu = '1' + newSnafu
  } else if (last === '1') {
    newSnafu = '2' + newSnafu
  } else if (last === '2') {
    newSnafu = '=' + newSnafu
    carry = true
  } else if (last === '=') {
    newSnafu = '-' + newSnafu
  } else if (last === '-') {
    newSnafu = '0' + newSnafu
  }

  for (var c = snafu.length - 2; c >= 0; c--) {
    const char = snafu.charAt(c)
    if (carry) {
      if (char === '0') {
        newSnafu = '1' + newSnafu
        carry = false
      } else if (char === '1') {
        newSnafu = '2' + newSnafu
        carry = false
      } else if (char === '2') {
        newSnafu = '=' + newSnafu
        carry = true
      } else if (char === '=') {
        newSnafu = '-' + newSnafu
        carry = false
      } else if (char === '-') {
        newSnafu = '0' + newSnafu
        carry = false
      }
    } else {
      newSnafu = char + newSnafu
    }
  }
  if (carry) {
    newSnafu = '1' + newSnafu
  }

  return newSnafu
}

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\n+/)

    // as decimal
    /*
    var numbers = $.map(numberStrings, (val => {return snafuToDecimal(val)}))
    // console.log(numbers)

    const sum = numbers.reduce((acc,val) => {
      return acc + val
    })
    console.log(sum)
    */

    const totalSnafuSum = numberStrings.reduce((acc,val) => {
      return snafuSum(acc,val)
    })
    // console.log(totalSnafuSum,snafuToDecimal(totalSnafuSum))

    // for debug
    /*
    var partial = '0'
    for (var n = 0; n < numberStrings.length; n++) {
      var newPartial = snafuSum(partial,numberStrings[n])
      console.log(snafuToDecimal(partial),snafuToDecimal(numberStrings[n]),snafuToDecimal(newPartial),
        (snafuToDecimal(partial) + snafuToDecimal(numberStrings[n]) === snafuToDecimal(newPartial)) )
      partial = newPartial
    }
    console.log(partial,snafuToDecimal(partial))
    */

    const result = totalSnafuSum

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  $('#part2').append('part 2 requires only to have all other stars')
    .append('<br>')
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
