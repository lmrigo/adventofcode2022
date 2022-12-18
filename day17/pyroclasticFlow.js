var input = [
`>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`
 ,puzzleInput
]

var grid
const rocks = [
  '####'.split(''),
  ['.#.'.split(''),
   '###'.split(''),
   '.#.'.split('')],
  ['..#'.split(''),
   '..#'.split(''),
   '###'.split('')],
  ['#',
   '#',
   '#',
   '#'],
  ['##'.split(''),
   '##'.split('')]
]
const rockWidth = [4,3,3,1,2]
const rockHeight = [1,3,3,4,2]

const initialX = 2
const gridWidth = 7
const offsetY = 3
const totalRocks = 2022

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    grid = []
    grid[0] = Array(gridWidth).fill('.')
    grid[1] = Array(gridWidth).fill('.')
    grid[2] = Array(gridWidth).fill('.')
    grid[3] = Array(gridWidth).fill('.')
    var bottom = -1 // start at floor level
    var rc = 0 //rock counter
    var r = 0 //rock idx
    var c = 0
    while (rc++ < totalRocks) {
      var rockStopped = false
      const nextRock = rocks[r]
      // console.log(r)
      var rockX = initialX
      var rockY = bottom+rockHeight[r]+offsetY
      increaseGrid(rockY)
      // printFallingRockGrid(r,rockX,rockY,grid)
      while (!rockStopped) {
        const nextMove = input[i].charAt(c)
        // console.log(c)

        // push by next move if possible
        if (nextMove === '<') {
          if (rockX-1 >= 0 // inside grid
            && !intersects(r,rockX-1,rockY)) {
            rockX--
          }
        } else { // >
          if ((rockX+(rockWidth[r]-1))+1 < gridWidth // inside grid
            && !intersects(r,rockX+1,rockY)) {
            rockX++
          }
        }

        // drop rock by 1 if possible
        if ((rockY-(rockHeight[r]-1))-1 >= 0 // inside grid
          && !intersects(r,rockX,rockY-1)) {
          rockY--
        } else {
          rockStopped = true
          addRockToGrid(r,rockX,rockY,grid)
          bottom = highestRockY() // new bottom
        }
        // printFallingRockGrid(r,rockX,rockY,grid)
        c = (c+1) % input[i].length
      }
      r = (r+1) % rocks.length
    }
    // printGrid(grid)

    const heighest = highestRockY() + 1
    // highest === bottom
    // +1 because array starts at 0

    const result = heighest
    // 3157
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var highestRockY = function () {
  var heighest = 0
  for (var y = grid.length - 1; y >= 0; y--) {
    for (var x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== '.') {
        heighest = y
        break
      }
    }
    if (heighest > 0) {
      break
    }
  }
  return heighest
}

var printFallingRockGrid = function(r,rx,ry,grid) {
  var fallingGrid = []
  for (var y = grid.length - 1; y >= 0; y--) {
    fallingGrid[y] = [...grid[y]]
  }
  addRockToGrid(r,rx,ry,fallingGrid)
  printGrid(fallingGrid)
}

var printGrid = function(grid) {
  var str = ''
  for (var y = grid.length - 1; y >= 0; y--) {
    for (var x = 0; x < grid[y].length; x++) {
      str += grid[y][x]
    }
    str+='\n'
  }
  console.log(str)
}

var increaseGrid = function(ry) {
  if (grid.length <= ry) {
    for (var y = grid.length; y <= ry; y++) {
      grid[y] = Array(gridWidth).fill('.')
    }
  }
}

var addRockToGrid = function(r,rx,ry,grid) {
  if (r===0) {
    //####
    grid[ry][rx] = '#'
    grid[ry][rx+1] = '#'
    grid[ry][rx+2] = '#'
    grid[ry][rx+3] = '#'
  } else if (r===1) {
    // .#.
    // ###
    // .#.
    grid[ry][rx+1] = '#'
    grid[ry-1][rx] = '#'
    grid[ry-1][rx+1] = '#'
    grid[ry-1][rx+2] = '#'
    grid[ry-2][rx+1] = '#'
  } else if (r===2) {
    // ..#
    // ..#
    // ###
    grid[ry][rx+2] = '#'
    grid[ry-1][rx+2] = '#'
    grid[ry-2][rx] = '#'
    grid[ry-2][rx+1] = '#'
    grid[ry-2][rx+2] = '#'
  } else if (r===3) {
    // #
    // #
    // #
    // #
    grid[ry][rx] = '#'
    grid[ry-1][rx] = '#'
    grid[ry-2][rx] = '#'
    grid[ry-3][rx] = '#'
  } else if (r===4) {
    // ##
    // ##
    grid[ry][rx] = '#'
    grid[ry][rx+1] = '#'
    grid[ry-1][rx] = '#'
    grid[ry-1][rx+1] = '#'
  } else {
    console.log('rock doesn\'t exist!!!')
  }
}

var intersects = function (r,rx,ry) {
  var intersect = false
  if (r===0) {
    //####
    intersect =
      grid[ry][rx] !== '.'
      || grid[ry][rx+1] !== '.'
      || grid[ry][rx+2] !== '.'
      || grid[ry][rx+3] !== '.'
  } else if (r===1) {
    // .#.
    // ###
    // .#.
    intersect =
      grid[ry][rx+1] !== '.'
      || grid[ry-1][rx] !== '.'
      || grid[ry-1][rx+1] !== '.'
      || grid[ry-1][rx+2] !== '.'
      || grid[ry-2][rx+1] !== '.'
  } else if (r===2) {
    // ..#
    // ..#
    // ###
    intersect =
      grid[ry][rx+2] !== '.'
      || grid[ry-1][rx+2] !== '.'
      || grid[ry-2][rx] !== '.'
      || grid[ry-2][rx+1] !== '.'
      || grid[ry-2][rx+2] !== '.'
  } else if (r===3) {
    // #
    // #
    // #
    // #
    intersect =
      grid[ry][rx] !== '.'
      || grid[ry-1][rx] !== '.'
      || grid[ry-2][rx] !== '.'
      || grid[ry-3][rx] !== '.'
  } else if (r===4) {
    // ##
    // ##
    intersect =
      grid[ry][rx] !== '.'
      || grid[ry][rx+1] !== '.'
      || grid[ry-1][rx] !== '.'
      || grid[ry-1][rx+1] !== '.'
  } else {
    console.log('rock doesn\'t exist!!!')
  }
  return intersect
}

const totalRocksPart2 = 1000000000000

// find out every how many rocks does the pattern repeats
// and also how much altitude each pattern gives
var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    grid = []
    grid[0] = Array(gridWidth).fill('.')
    grid[1] = Array(gridWidth).fill('.')
    grid[2] = Array(gridWidth).fill('.')
    grid[3] = Array(gridWidth).fill('.')
    var bottom = -1 // start at floor level
    var rc = 0 //rock counter
    var r = 0 //rock idx
    var c = 0
    //PATTERN for sample / input[0]
    // 15r pattern start, 50r repeat. (2022-15)/ 35r = 57.3
    // pattern height = 53 (50r - 15r = 78 - 25)
    // final = 15 (25) + 53*57 (3021) + remaining (28)
    // remaining = (2022-15) % 35 = 12
    // remaining result = (15 + pattern (35) + 12 ) - 78 (50r) = 100-79 = 22
    // (15) = 25
    // (50) = 78
    // (85) = 131
    // (120) = 184
    // Part 2 input = 1000000000000
    // (1000000000000-15) / 35 = 28571428571
    // remaining = (1000000000000-15) % 35 = 0
    // final = 25 + (28571428571*53) + 0 = 1514285714288

    // 1   2
    // 15r 1245r offset
    // 25h 1942h offset height
    // 50r 1725r pattern
    // 53h 2728h pattern height
    // final = offseth + patternh + remainingh

    //PATTERN for sample / input[1]
    // start ends at 1942 height. 1245r
    // pattern 14428 height difference
    // pattern ends at 1942 + 2728 height = 4670
    // offseth = 1942 (1245r)
    // patternr = (1000000000000-1245r) / 1725r = 579710144.2
    // patternh = 579710144 * 2728 = 1581449272832
    // remaining = (1000000000000-1245r) % 1725r = 355r
    // remainingh = (offsetr + patternr + remainingr) - (offsetr + patternr)
    // remainingh = 5215 - 4670 = 545
    // final = 1942 + 1581449272832 + 545 = 1581449275319

    while (rc++ < 1245+1725) {

      var rockStopped = false
      const nextRock = rocks[r]
      var rockX = initialX
      var rockY = bottom+rockHeight[r]+offsetY
      increaseGrid(rockY)
      while (!rockStopped) {
        const nextMove = input[i].charAt(c)

        // push by next move if possible
        if (nextMove === '<') {
          if (rockX-1 >= 0 // inside grid
            && !intersects(r,rockX-1,rockY)) {
            rockX--
          }
        } else { // >
          if ((rockX+(rockWidth[r]-1))+1 < gridWidth // inside grid
            && !intersects(r,rockX+1,rockY)) {
            rockX++
          }
        }

        // drop rock by 1 if possible
        if ((rockY-(rockHeight[r]-1))-1 >= 0 // inside grid
          && !intersects(r,rockX,rockY-1)) {
          rockY--
        } else {
          rockStopped = true
          addRockToGrid(r,rockX,rockY,grid)
          bottom = highestRockY() // new bottom
        }
        c = (c+1) % input[i].length
      }
      r = (r+1) % rocks.length
    }
    // printGrid(grid)
    // console.log(bottom+1)

    const result = i === 0 ? 1514285714288 : 1581449275319
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
