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

/*
example:
  1
234
  56
puzzle:
 12
 3
45
6
*/
var quadrantInputExample =
`
        1111
        1111
        1111
        1111
222233334444
222233334444
222233334444
222233334444
        55556666
        55556666
        55556666
        55556666
`

var grid
const directions = ['E','S','W','N']
var walkGrid
const walkDirections = ['>','v','<','^']

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

var quadrantWidth
var quadrants
var quadOffsets
var quadNeighbours
var walkQuads

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var inputStrings = input[i].split(/\n+/)
    const commandString = inputStrings.splice(inputStrings.length-1,1)[0]
    // console.log(commandString)
    const regex = /\d+|\w/g
    const command = commandString.match(regex)
    // console.log(command)

    quadrantWidth = i==0 ? 4 : 50
    quadrants = []
    walkQuads = []
    for (var q = 1; q <= 6; q++) {
      quadrants[q] = []
      walkQuads[q] = []
    }
    quadNeighbours = []
    quadOffsets = []
    if (i==0) {
      /*
        1
      234
        56
      */
      //1
      quadOffsets = [
        {},//0
        {y: 0,               x: quadrantWidth*2},//1
        {y: quadrantWidth,   x: 0              },//2
        {y: quadrantWidth,   x: quadrantWidth  },//3
        {y: quadrantWidth,   x: quadrantWidth*2},//4
        {y: quadrantWidth*2, x: quadrantWidth*2},//5
        {y: quadrantWidth*2, x: quadrantWidth*3} //6
      ]
      quadNeighbours[1] = [
        {q:6,side:'R',top:'B',dir:'W'}, //E
        {q:4,side:'T',top:'T',dir:'S'}, //S
        {q:3,side:'T',top:'L',dir:'S'}, //W
        {q:2,side:'T',top:'B',dir:'S'}  //N
      ]
      //2
      quadNeighbours[2] = [
        {q:3,side:'L',top:'T',dir:'E'}, //E
        {q:5,side:'B',top:'B',dir:'N'}, //S
        {q:6,side:'B',top:'R',dir:'W'}, //W
        {q:1,side:'T',top:'B',dir:'S'}  //N
      ]
      //3
      quadNeighbours[3] = [
        {q:4,side:'L',top:'T',dir:'E'}, //E
        {q:5,side:'L',top:'L',dir:'E'}, //S
        {q:2,side:'R',top:'T',dir:'W'}, //W
        {q:1,side:'L',top:'R',dir:'R'}  //N
      ]
      //4
      quadNeighbours[4] = [
        {q:6,side:'T',top:'R',dir:'S'}, //E
        {q:5,side:'T',top:'T',dir:'S'}, //S
        {q:3,side:'R',top:'T',dir:'W'}, //W
        {q:1,side:'B',top:'T',dir:'N'}  //N
      ]
      //5
      quadNeighbours[5] = [
        {q:6,side:'L',top:'T',dir:'E'}, //E
        {q:2,side:'B',top:'B',dir:'N'}, //S
        {q:3,side:'B',top:'R',dir:'N'}, //W
        {q:4,side:'B',top:'T',dir:'N'}  //N
      ]
      //6
      quadNeighbours[6] = [
        {q:1,side:'R',top:'B',dir:'W'}, //E
        {q:2,side:'L',top:'L',dir:'E'}, //S
        {q:5,side:'R',top:'T',dir:'W'}, //W
        {q:4,side:'R',top:'L',dir:'W'}  //N
      ]

      for (var q = 1; q <= 6; q++) {
        for (var y = quadOffsets[q].y; y < quadOffsets[q].y + quadrantWidth; y++) {
          quadrants[q][y-quadOffsets[q].y] = []
          walkQuads[q][y-quadOffsets[q].y] = []
          for (var x = quadOffsets[q].x; x < quadOffsets[q].x + quadrantWidth; x++) {
            quadrants[q][y-quadOffsets[q].y][x-quadOffsets[q].x] = inputStrings[y].charAt(x)
            walkQuads[q][y-quadOffsets[q].y][x-quadOffsets[q].x] = inputStrings[y].charAt(x)
          }
        }
        // console.log(quadrants[q])
      }
    } else {
      /*
       12
       3
      45
      6
      */
            quadOffsets = [
        {},//0
        {y: 0,               x: quadrantWidth  },//1
        {y: 0,               x: quadrantWidth*2},//2
        {y: quadrantWidth,   x: quadrantWidth  },//3
        {y: quadrantWidth*2, x: 0              },//4
        {y: quadrantWidth*2, x: quadrantWidth  },//5
        {y: quadrantWidth*3, x: 0              } //6
      ]
      quadNeighbours[1] = [
        {q:2,side:'L',top:'T',dir:'E'}, //E
        {q:3,side:'T',top:'T',dir:'S'}, //S
        {q:4,side:'L',top:'B',dir:'E'}, //W
        {q:6,side:'L',top:'L',dir:'E'}  //N
      ]
      //2
      quadNeighbours[2] = [
        {q:5,side:'R',top:'B',dir:'W'}, //E
        {q:3,side:'R',top:'L',dir:'W'}, //S
        {q:1,side:'R',top:'T',dir:'W'}, //W
        {q:6,side:'B',top:'T',dir:'N'}  //N
      ]
      //3
      quadNeighbours[3] = [
        {q:2,side:'B',top:'R',dir:'N'}, //E
        {q:5,side:'T',top:'T',dir:'S'}, //S
        {q:4,side:'T',top:'R',dir:'S'}, //W
        {q:1,side:'B',top:'T',dir:'N'}  //N
      ]
      //4
      quadNeighbours[4] = [
        {q:5,side:'L',top:'T',dir:'E'}, //E
        {q:6,side:'T',top:'T',dir:'S'}, //S
        {q:1,side:'L',top:'B',dir:'E'}, //W
        {q:3,side:'L',top:'L',dir:'E'}  //N
      ]
      //5
      quadNeighbours[5] = [
        {q:2,side:'R',top:'B',dir:'W'}, //E
        {q:6,side:'R',top:'L',dir:'W'}, //S
        {q:4,side:'R',top:'T',dir:'W'}, //W
        {q:3,side:'B',top:'T',dir:'N'}  //N
      ]
      //6
      quadNeighbours[6] = [
        {q:5,side:'B',top:'R',dir:'N'}, //E
        {q:2,side:'T',top:'T',dir:'S'}, //S
        {q:1,side:'T',top:'R',dir:'S'}, //W
        {q:4,side:'B',top:'T',dir:'N'}  //N
      ]

      for (var q = 1; q <= 6; q++) {
        for (var y = quadOffsets[q].y; y < quadOffsets[q].y + quadrantWidth; y++) {
          quadrants[q][y-quadOffsets[q].y] = []
          walkQuads[q][y-quadOffsets[q].y] = []
          for (var x = quadOffsets[q].x; x < quadOffsets[q].x + quadrantWidth; x++) {
            quadrants[q][y-quadOffsets[q].y][x-quadOffsets[q].x] = inputStrings[y].charAt(x)
            walkQuads[q][y-quadOffsets[q].y][x-quadOffsets[q].x] = inputStrings[y].charAt(x)
          }
        }
        // console.log(quadrants[q])
      }
    }

    var initialPos = {q:1,y:0,x:0,d:'E'}
    var pos = initialPos

    for (var c = 0; c < command.length; c++) {
      const com = command[c]
      const numCom = Number(com)
      if (Number.isNaN(numCom)) {
        pos.d = turn(pos.d,com)
      } else { // walk
        pos = walk2(pos,numCom)
      }
    }

    // console.log(walkQuads)
    var walkGrid = []
    for (var y = 0; y < inputStrings.length; y++) {
      walkGrid[y] = []
      for (var x = 0; x < inputStrings[inputStrings.length-2].length; x++) {
        walkGrid[y][x] = '_'
      }
    }
    for (var q = 1; q <= 6; q++) {
      for (var y = 0; y < quadrantWidth; y++) {
        for (var x = 0; x < quadrantWidth; x++) {
          walkGrid[y+quadOffsets[q].y][x+quadOffsets[q].x] = walkQuads[q][y][x]
        }
      }
    }
    // printGrid(walkGrid)

    // console.log(pos.q,pos.y,pos.x,pos.d)
    const row = (quadOffsets[pos.q].y + pos.y+1)*1000
    const col = (quadOffsets[pos.q].x + pos.x+1)*4
    const face = directions.indexOf(pos.d)
    // console.log(row,col,face)
    const result = row+col+face
    // 144361
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var walk2 = function(startPos,steps) {
  var pos = {}
  Object.assign(pos,startPos)
  var wall = false
  while (steps-- > 0 && !wall) {
    walkQuads[pos.q][pos.y][pos.x] = walkDirections[directions.indexOf(pos.d)]
    // console.log(walkQuads[pos.q])
    if (pos.d === 'N') { //up
      if (pos.y-1 < 0
         || quadrants[pos.q][pos.y-1][pos.x] === undefined) {
        const neighbour = quadNeighbours[pos.q][3]//ESWN
        var nextQ = neighbour.q
        var nextY = pos.y
        var nextX = pos.x
        var nextDir = pos.d
        if (neighbour.side === 'B') {
          nextY = quadrantWidth-1
        } else if (neighbour.side === 'T') {
          nextY = 0
          nextX = (quadrantWidth-1) - pos.x
          nextDir = neighbour.dir
        } else if (neighbour.side === 'L') {
          nextY = pos.x
          nextX = 0
          nextDir = neighbour.dir
        } else if (neighbour.side === 'R') {
          nextY = pos.x
          nextX = quadrantWidth-1
          nextDir = neighbour.dir
        } else {
          console.log('errouNQ')
        }
        if (quadrants[nextQ][nextY][nextX] === '.') {
          pos.q = nextQ
          pos.y = nextY
          pos.x = nextX
          pos.d = nextDir
        } else if (quadrants[nextQ][nextY][nextX] === '#') {
          wall = true
        }
      } else if (quadrants[pos.q][pos.y-1][pos.x] === '#') {
        wall = true
      } else if (quadrants[pos.q][pos.y-1][pos.x] === '.') {
        pos.y--
      } else {
        console.log('errouN')
      }
    } else if (pos.d === 'E') { //right
      if (pos.x+1 >= quadrants[pos.q][pos.y].length
          || quadrants[pos.q][pos.y][pos.x+1] === undefined) {
        const neighbour = quadNeighbours[pos.q][0]//ESWN
        var nextQ = neighbour.q
        var nextY = pos.y
        var nextX = pos.x
        var nextDir = pos.d
        if (neighbour.side === 'L') {
          nextX = 0
        } else if (neighbour.side === 'R') {
          nextY = (quadrantWidth-1) - pos.y
          nextX = quadrantWidth-1
          nextDir = neighbour.dir
        } else if (neighbour.side === 'T') {
          nextY = 0
          nextX = (quadrantWidth-1) - pos.y
          nextDir = neighbour.dir
        } else if (neighbour.side === 'B') {
          nextY = quadrantWidth-1
          nextX = pos.y
          nextDir = neighbour.dir
        } else {
          console.log('errouEQ')
        }
        if (quadrants[nextQ][nextY][nextX] === '.') {
          pos.q = nextQ
          pos.y = nextY
          pos.x = nextX
          pos.d = nextDir
        } else if (quadrants[nextQ][nextY][nextX] === '#') {
          wall = true
        }
      } else if (quadrants[pos.q][pos.y][pos.x+1] === '#') {
        wall = true
      } else if (quadrants[pos.q][pos.y][pos.x+1] === '.') {
        pos.x++
      } else {
        console.log('errouE')
      }
    } else if (pos.d === 'S') { //down
      if (pos.y+1 >= quadrants[pos.q].length
          || quadrants[pos.q][pos.y+1][pos.x] === undefined) {
        const neighbour = quadNeighbours[pos.q][1]//ESWN
        var nextQ = neighbour.q
        var nextY = pos.y
        var nextX = pos.x
        var nextDir = pos.d
        if (neighbour.side === 'T') {
          nextY = 0
        } else if (neighbour.side === 'B') {
          nextY = quadrantWidth-1
          nextX = (quadrantWidth-1) - pos.x
          nextDir = neighbour.dir
        } else if (neighbour.side === 'L') {
          nextY = (quadrantWidth-1) - pos.x
          nextX = 0
          nextDir = neighbour.dir
        } else if (neighbour.side === 'R') {
          nextY = pos.x
          nextX = quadrantWidth-1
          nextDir = neighbour.dir
        } else {
          console.log('errouSQ')
        }
        if (quadrants[nextQ][nextY][nextX] === '.') {
          pos.q = nextQ
          pos.y = nextY
          pos.x = nextX
          pos.d = nextDir
        } else if (quadrants[nextQ][nextY][nextX] === '#') {
          wall = true
        }
      } else if (quadrants[pos.q][pos.y+1][pos.x] === '#') {
        wall = true
      } else if (quadrants[pos.q][pos.y+1][pos.x] === '.') {
        pos.y++
      } else {
        console.log('errouS')
      }
    } else if (pos.d === 'W') { //left
      if (pos.x-1 < 0
          || quadrants[pos.q][pos.y][pos.x-1] === undefined) {
        const neighbour = quadNeighbours[pos.q][2]//ESWN
        var nextQ = neighbour.q
        var nextY = pos.y
        var nextX = pos.x
        var nextDir = pos.d
        if (neighbour.side === 'R') {
          nextX = quadrantWidth-1
        } else if (neighbour.side === 'B') {
          nextY = quadrantWidth-1
          nextX = (quadrantWidth-1) - pos.y
          nextDir = neighbour.dir
        } else if (neighbour.side === 'T') {
          nextY = 0
          nextX = pos.y
          nextDir = neighbour.dir
        } else if (neighbour.side === 'L') {
          nextY = (quadrantWidth-1) - pos.y
          nextX = 0
          nextDir = neighbour.dir
        } else {
          console.log('errouWQ')
        }
        if (quadrants[nextQ][nextY][nextX] === '.') {
          pos.q = nextQ
          pos.y = nextY
          pos.x = nextX
          pos.d = nextDir
        } else if (quadrants[nextQ][nextY][nextX] === '#') {
          wall = true
        } else {
          nextX--
        }
      } else if (quadrants[pos.q][pos.y][pos.x-1] === '#') {
        wall = true
      } else if (quadrants[pos.q][pos.y][pos.x-1] === '.') {
        pos.x--
      } else {
        console.log('errouW')
      }
    } else {
      console.log('unsupported direction')
    }
  }
  walkQuads[pos.q][pos.y][pos.x] = walkDirections[directions.indexOf(pos.d)]
  return pos
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
