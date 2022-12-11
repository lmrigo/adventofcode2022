var input = [
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`
 ,puzzleInput
]

// let's hardcode the 1st part of the puzzle input
var ships = []
var initShips = function() {
  ships = [
    [
      ['Z','N'],//1
      ['M','C','D'],//2
      ['P']//3
    ],
    [
      ['G','F','V','H','P','S'],//1
      ['G','J','F','B','V','D','Z','M'],//2
      ['G','M','L','J','N'],//3
      ['N','G','Z','V','D','W','P'],//4
      ['V','R','C','B'],//5
      ['V','R','S','M','P','W','L','Z'],//6
      ['T','H','P'],//7
      ['Q','R','S','N','C','H','Z','V'],//8
      ['F','L','G','P','V','Q','J']//9
    ]
  ]
  return ships
}


var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    initShips()
    var commandStrings = input[i].split(/\n+/)
    var skip = 0
    while (!commandStrings[skip].startsWith('move')) {
      skip++
    }
    for (var j = skip; j < commandStrings.length; j++) {
      var command = commandStrings[j].split(/\s+/)
      // var move = command[0]
      var count = Number(command[1])
      // var from = command[2]
      var source = Number(command[3])-1 //-1 offset to array that starts with 0
      // var to = command[4]
      var destiny = Number(command[5])-1
      
      while (count > 0) {
        var crate = ships[i][source].pop()
        ships[i][destiny].push(crate)
        count--
      }
    }

    var tops = ''
    for (var stack = 0; stack < ships[i].length; stack++) {
      var crate = ships[i][stack].pop()
      tops+= crate
    }

    var result = tops
    // FCVRLMVQP
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {
  initShips()
  for (var i = 0; i < input.length; i++) {
    var commandStrings = input[i].split(/\n+/)
    var skip = 0
    while (!commandStrings[skip].startsWith('move')) {
      skip++
    }
    for (var j = skip; j < commandStrings.length; j++) {
      var command = commandStrings[j].split(/\s+/)
      // var move = command[0]
      var count = Number(command[1])
      // var from = command[2]
      var source = Number(command[3])-1 //-1 offset to array that starts with 0
      // var to = command[4]
      var destiny = Number(command[5])-1
      
      var buffer = []
      var countBuffer = count
      while (countBuffer > 0) {
        var crate = ships[i][source].pop()
        buffer.push(crate)
        countBuffer--
      }
      while (count > 0) {
        var crate = buffer.pop()
        ships[i][destiny].push(crate)
        count--
      }
    }

    var tops = ''
    for (var stack = 0; stack < ships[i].length; stack++) {
      var crate = ships[i][stack].pop()
      tops+= crate
    }

    var result = tops
    // RWLWGJGFD
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
