var input = [
`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var commandStrings = input[i].split(/\n+/)
    var positions = {}
    var head = {x:0,y:0}
    var tail = {x:0,y:0}
    $.each(commandStrings,(idx,val) => {
      const command = val.split(/\s+/)
      const direction = command[0]
      var steps = Number(command[1])
      while (steps-- > 0) {
        if (direction === 'U') {
          head.y--
          if (isFar(head,tail)) {
            tail.y--
            if (head.x < tail.x) {
              tail.x--
            } else if (head.x > tail.x) {
              tail.x++
            }// else head.x === tail.x
          }
        } else if (direction === 'D') {
          head.y++
          if (isFar(head,tail)) {
            tail.y++
            if (head.x < tail.x) {
              tail.x--
            } else if (head.x > tail.x) {
              tail.x++
            }// else head.x === tail.x
          }
        } else if (direction === 'L') {
          head.x--
          if (isFar(head,tail)) {
            tail.x--
            if (head.y < tail.y) {
              tail.y--
            } else if (head.y > tail.y) {
              tail.y++
            }// else head.x === tail.x
          }
        } else if (direction === 'R') {
          head.x++
          if (isFar(head,tail)) {
            tail.x++
            if (head.y < tail.y) {
              tail.y--
            } else if (head.y > tail.y) {
              tail.y++
            }// else head.x === tail.x
          }
        } else {
          console.error('errou!')
        }
        // log position
        positions[tail.x+','+tail.y] = true
      }
    })

    // console.log(positions)
    // console.log(Object.keys(positions).length)
    const totalVisitedPositions = Object.keys(positions).length
    const result = totalVisitedPositions
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var isFar = function(head,tail) {
  const xDist = Math.abs(head.x-tail.x) > 1
  const yDist = Math.abs(head.y-tail.y) > 1
  return xDist || yDist
}

var part2 = function () {

  for (var i = 1; i < input.length; i++) {
    var commandStrings = input[i].split(/\n+/)
    var positions = {}
    var rope = $.map(Array(10),()=> {return {x:0,y:0}})
    $.each(commandStrings,(idx,val) => {
      const command = val.split(/\s+/)
      const direction = command[0]
      var steps = Number(command[1])
      while (steps-- > 0) {
          var head = rope[0]
          if (direction === 'U') {
            head.y--
          } else if (direction === 'D') {
            head.y++
          } else if (direction === 'L') {
            head.x--
          } else if (direction === 'R') {
            head.x++
          } else {
            console.error('errou!')
          }
        for (var k = 0; k < rope.length-1; k++) {
          var head = rope[k]
          var tail = rope[k+1]
          var tailMoved = false
          if (isFar(head,tail)) {
            if (head.y - tail.y < -1) { //check up
              tail.y--
              tailMoved = true
              //check diagonals
              if (head.x < tail.x) {
                tail.x--
              } else if (head.x > tail.x) {
                tail.x++
              }// else head.x === tail.x
            } else if (head.y - tail.y > 1) { //check down
              tail.y++
              tailMoved = true
              //check diagonals
              if (head.x < tail.x) {
                tail.x--
              } else if (head.x > tail.x) {
                tail.x++
              }// else head.x === tail.x
            } else if (head.x - tail.x < - 1) { //check left
              tail.x--
              tailMoved = true
              //check diagonals
              if (head.y < tail.y) {
                tail.y--
              } else if (head.y > tail.y) {
                tail.y++
              }// else head.x === tail.x
            } else if (head.x - tail.x > 1) { //check right
              tail.x++
              tailMoved = true
              //check diagonals
              if (head.y < tail.y) {
                tail.y--
              } else if (head.y > tail.y) {
                tail.y++
              }// else head.x === tail.x
            }
          }
          if (!tailMoved) {
            break
          }
        }
        // log position
        positions[rope[9].x+','+rope[9].y] = true
        // buildRopeGrid(rope)
        // printRope(rope)
      }
    })

    // console.log(positions)
    // console.log(Object.keys(positions).length)
    // printGrid(positions,-10,12,-8,5)

    const totalVisitedPositions = Object.keys(positions).length
    const result = totalVisitedPositions
    // console.log(result)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var ropeGrid = []
var maxsize = 15
var buildRopeGrid = function(rope) {
  for (var x = -maxsize; x < maxsize; x++) {
    if (ropeGrid[x] === undefined) ropeGrid[x]=[]
    for (var y = -maxsize; y < maxsize; y++) {
      ropeGrid[x][y] = '.'
    }
  }
  $.each(rope, (idx,val) => {
    ropeGrid[val.x][val.y] = idx
  })
}

var printRope = function(rope) {
  var str = ''
  for (var y = -maxsize; y < maxsize; y++) {
    for (var x = -maxsize; x < maxsize; x++) {
      str += ropeGrid[x][y]
    }
    str += '\n'
  }
  str += '\n'
  console.log(str)
}

var printGrid = function (positions,minx,maxx,miny,maxy) {
  var grid = ''
  for (var y = miny ; y < maxy; y++) {
    grid += ''+y
  }
  grid +='\n'
  for (var x = maxx - 1; x >= minx; x--) {
    grid+=''+x
    for (var y = miny; y < maxy; y++) {
      const pos = positions[x+','+y]
      grid += pos === undefined ? '.' : '#'
    }
    grid += '\n'
  }
  console.log(grid)
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
