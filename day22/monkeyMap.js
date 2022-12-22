var input = [
`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`
 ,puzzleInput
]

var grid
const directions = ['E','S','W','N']
var walkGrid
const walkDirections = ['>','V','<','^']

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var inputStrings = input[i].split(/\n+/)
    const commandString = inputStrings.splice(inputStrings.length-1,1)[0]
    // console.log(commandString)
    const regex = /\d+|\w/g
    const command = commandString.match(regex)
    // console.log(command)
    grid = []
    walkGrid = []
    for (var y = 0; y < inputStrings.length; y++) {
      grid[y] = inputStrings[y].split('')
      walkGrid[y] = inputStrings[y].split('')
    }
    // console.log(grid)

    var initialPos = {y:0,x:grid[0].indexOf('.')}
    var direction = 'E' //east
    var pos = initialPos

    for (var c = 0; c < command.length; c++) {
      const com = command[c]
      const numCom = Number(com)
      if (Number.isNaN(numCom)) {
        direction = turn(direction,com)
      } else { // walk
        pos = walk(pos,direction,numCom)
      }
    }
    // printGrid(walkGrid)

    // console.log(pos.y,pos.x,direction)
    const row = (pos.y+1)*1000
    const col = (pos.x+1)*4
    const face = directions.indexOf(direction)
    // console.log(row,col,face)
    const result = row+col+face
    // 95358
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var turn = function(direction,rl) {
  const dirIdx = directions.indexOf(direction)
  var newDirIdx
  if (rl === 'R') {
    newDirIdx = (dirIdx+1) % directions.length
  } else { //L
    newDirIdx = ((dirIdx+directions.length)-1) % directions.length
  }
  return directions[newDirIdx]
}

var walk = function(startPos,direction,steps) {
  var pos = {}
  Object.assign(pos,startPos)
  var wall = false
  while (steps-- > 0 && !wall) {
    walkGrid[pos.y][pos.x] = walkDirections[directions.indexOf(direction)]
    if (direction === 'N') { //up
      if (pos.y-1 < 0
         || grid[pos.y-1][pos.x] === ' '
         || grid[pos.y-1][pos.x] === undefined) {
        var nextY = grid.length-1
        var found = false
        while (!found && nextY > 0) {
          if (grid[nextY][pos.x] === '.') {
            found = true
            pos.y = nextY
          } else if (grid[nextY][pos.x] === '#') {
            found = true
            wall = true
            pos.y = pos.y
          } else {
            nextY--
          }
        }
      } else if (grid[pos.y-1][pos.x] === '#') {
        wall = true
      } else if (grid[pos.y-1][pos.x] === '.') {
        pos.y--
      } else {
        console.log('errou')
      }
    } else if (direction === 'E') { //right
      if (pos.x+1 >= grid[pos.y].length
          || grid[pos.y][pos.x+1] === ' '
          || grid[pos.y][pos.x+1] === undefined) {
        var nextX = 0
        var found = false
        while (!found && nextX < grid[pos.y].length) {
          if (grid[pos.y][nextX] === '.') {
            found = true
            pos.x = nextX
          } else if (grid[pos.y][nextX] === '#') {
            found = true
            wall = true
            pos.x = pos.x
          } else {
            nextX++
          }
        }
      } else if (grid[pos.y][pos.x+1] === '#') {
        wall = true
      } else if (grid[pos.y][pos.x+1] === '.') {
        pos.x++
      } else {
        console.log('errou')
      }
    } else if (direction === 'S') { //down
      if (pos.y+1 >= grid.length
          || grid[pos.y+1][pos.x] === ' '
          || grid[pos.y+1][pos.x] === undefined) {
        var nextY = 0
        var found = false
        while (!found && nextY < grid.length) {
          if (grid[nextY][pos.x] === '.') {
            found = true
            pos.y = nextY
          } else if (grid[nextY][pos.x] === '#') {
            found = true
            wall = true
            pos.y = pos.y
          } else {
            nextY++
          }
        }
      } else if (grid[pos.y+1][pos.x] === '#') {
        wall = true
      } else if (grid[pos.y+1][pos.x] === '.') {
        pos.y++
      } else {
        console.log('errou')
      }
    } else if (direction === 'W') { //left
      if (pos.x-1 < 0 || grid[pos.y][pos.x-1] === ' '
          || grid[pos.y][pos.x-1] === undefined) {
        var nextX = grid[pos.y].length-1
        var found = false
        while (!found && nextX > 0) {
          if (grid[pos.y][nextX] === '.') {
            found = true
            pos.x = nextX
          } else if (grid[pos.y][nextX] === '#') {
            found = true
            wall = true
            pos.x = pos.x
          } else {
            nextX--
          }
        }
      } else if (grid[pos.y][pos.x-1] === '#') {
        wall = true
      } else if (grid[pos.y][pos.x-1] === '.') {
        pos.x--
      } else {
        console.log('errou')
      }
    } else {
      console.log('unsupported direction')
    }
  }
  walkGrid[pos.y][pos.x] = walkDirections[directions.indexOf(direction)]
  return pos
}

var printGrid = function(gr) {
  var str = ''
  for (var y = 0; y < gr.length; y++) {
    for (var x = 0; x < gr[y].length; x++) {
      str += gr[y][x]
    }
    str += '\n'
  }
  console.log(str)
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var numbers = $.map(numberStrings, (val => {return Number(val)}))

    const result = 0
    // console.log(result)
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
