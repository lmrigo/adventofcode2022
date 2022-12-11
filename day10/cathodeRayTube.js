var input = [
`noop
addx 3
addx -5`,
`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`
 ,puzzleInput
]

function CPU () {
  this.regx = 1,
  this.cycles = 0,
  this.addx = function(v) {
    this.cycles+=2
    this.regx+=v
  },
  this.noop = function() {
    this.cycles++
  }
  this.signalStrenght = function() {
    return this.cycles * this.regx
  }
}

var part1 = function() {

  for (var i = 1; i < input.length; i++) {
    var instruction = input[i].split(/\n+/)

    var cyclesToCheck = [20, 60, 100, 140, 180,220]
    var ctc = 0

    var cpu = new CPU()
    $.each(instruction, (idx,val)=>{
      var prevRegx = cpu.regx
      // console.log(cpu.cycles, cpu.regx)
      var instruction = val.split(' ')
      cpu[instruction[0]](Number(instruction[1]))
      if (cpu.cycles >= cyclesToCheck[ctc]) {
        cyclesToCheck[ctc] *= prevRegx
        ctc++
      }
    })
    // console.log(cpu.cycles, cpu.regx)
    // console.log(cyclesToCheck)

    const result = cyclesToCheck.reduce((acc,val)=>{
      return acc+val
    })
    // 13180
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

const width = 40
const height = 6

var part2 = function () {

  for (var i = 1; i < input.length; i++) {
    var instruction = input[i].split(/\n+/)

    var cpu = new CPU()
    var screen = Array(height)
    var offset = -width
    var row = -1
    var checkLineBreak = function() {
      if (cpu.cycles % width === 0) {
        row++
        offset += width
        screen[row] = Array(width)
      }
    }
    // sprite is in regx and it's 3 wide
    var checkSprite = function() {
      return cpu.cycles-offset === (cpu.regx-1)
        || cpu.cycles-offset === cpu.regx
        || cpu.cycles-offset === (cpu.regx+1)
    }

    $.each(instruction, (idx,val)=>{
      checkLineBreak()
      var instruction = val.split(' ')
      if (instruction[0] === 'noop') {
        screen[row][cpu.cycles-offset] = checkSprite() ? '#' : '.'
        cpu.cycles++
      } else { //addx
        screen[row][cpu.cycles-offset] = checkSprite() ? '#' : '.'
        cpu.cycles++
        checkLineBreak()
        screen[row][cpu.cycles-offset] = checkSprite() ? '#' : '.'
        cpu.cycles++
        cpu.regx += Number(instruction[1])
      }
    })
    // console.log(screen)

    const display = printScreen(screen)
    // console.log(display)

    const result = display.replaceAll('\n','<br/>').replaceAll('.','_')
    // EZFCHJAB
    $('#part2').append(input[i])
      .append('<br>')
      .append(result)
      .append('<br>')
  }
}

var printScreen = function(screen) {
  var str = ''
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      str += screen[i][j]
    }
    str += '\n'
  }
  return str
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
