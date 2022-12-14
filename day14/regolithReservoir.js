var input = [
`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`
 ,puzzleInput
]

var grid
//x 450 - 550
var minX = 460
var maxX = 540
//y 0 - 180
const minY = 0
const maxY = 175
var floor

var resetGrid = function() {
  grid = []
  for (var y = minY; y < maxY; y++) {
    grid[y] = []
    for (var x = minX; x < maxX; x++) {
      grid[y][x] = '.'
    }
  }
}

var printGrid = function() {
  var str = ''
  for (var y = minY; y < maxY; y++) {
    for (var x = minX; x < maxX; x++) {
      str += grid[y][x]
    }
    str += '\n'
  }
  console.log(str)
}

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var rockLinesStrings = input[i].split(/\n+/)
    resetGrid()
    floor = minY
    // fill grid with rocks
    $.each(rockLinesStrings, (idx,val) => {
      var vertices = val.split(' -> ')
      var points = $.map(vertices,(v) => {
        const numStr = $.map(v.split(','), (x => Number(x)))
        return {x:numStr[0], y:numStr[1]}
      })
      // console.log(points)
      for (var p = 0; p < points.length-1; p++) {
        const p1 = points[p]
        const p2 = points[p+1]
        if (p1.x === p2.x) {// vertical
          if (p1.y < p2.y) {// down
            for (var y = p1.y; y <= p2.y; y++) {
              grid[y][p1.x] = '#'
            }
          } else {// up
            for (var y = p2.y; y <= p1.y; y++) {
              grid[y][p1.x] = '#'
            }
          }
        } else {// horizontal
          if (p1.x < p2.x) {// right
            for (var x = p1.x; x <= p2.x; x++) {
              grid[p1.y][x] = '#'
            }
          } else {// left
            for (var x = p2.x; x <= p1.x; x++) {
              grid[p1.y][x] = '#'
            }
          }
        }
        if (p1.y > floor) {
          floor = p1.y
        }
        if (p2.y > floor) {
          floor = p2.y
        }
      }
    })
    // printGrid()
    floor += 2
    // console.log(floor)

    // sand simulation
    var prevSandCount = -1
    var sandCount = 0
    var timeout = 10000
    while (timeout-- > 0 && sandCount !== prevSandCount) {
      prevSandCount = sandCount
      var sand = {x:500,y:0} // create new sand
      var prevSandY = -1
      var sandTimeout = 1000
      // drop sand
      while (sandTimeout-- > 0 && sand.y !== prevSandY) {
        prevSandY = sand.y
        if (isGoingToVoid(sand)) {
          // just do nothing
        } else if (canDropDown(sand)) {
          sand.y++
        } else if (canDropDownLeft(sand)) {
          sand.y++
          sand.x--
        } else if (canDropDownRight(sand)) {
          sand.y++
          sand.x++
        } else { // rest
          grid[sand.y][sand.x] = 'o'
          sandCount++
        }
      }
      if (sandTimeout < 0) console.log('sand timeout!')
    }
    if (timeout < 0) console.log('timeout!')

    // printGrid()
    const result = sandCount
    // 1133
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var isGoingToVoid = function(sand) {
  return sand.y >= floor
}

var canDropDown = function(sand) {
  return grid[sand.y+1][sand.x] === '.'
}

var canDropDownLeft = function(sand) {
  return grid[sand.y+1][sand.x-1] === '.'
}

var canDropDownRight = function(sand) {
  return grid[sand.y+1][sand.x+1] === '.'
}

var canRest = function(sand) {
  return grid[sand.y][sand.x] === '.'
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var rockLinesStrings = input[i].split(/\n+/)
    minX = 500 - (2 * maxY)
    maxX = 500 + (2 * maxY)
    resetGrid()
    floor = minY
    // fill grid with rocks
    $.each(rockLinesStrings, (idx,val) => {
      var vertices = val.split(' -> ')
      var points = $.map(vertices,(v) => {
        const numStr = $.map(v.split(','), (x => Number(x)))
        return {x:numStr[0], y:numStr[1]}
      })
      // console.log(points)
      for (var p = 0; p < points.length-1; p++) {
        const p1 = points[p]
        const p2 = points[p+1]
        if (p1.x === p2.x) {// vertical
          if (p1.y < p2.y) {// down
            for (var y = p1.y; y <= p2.y; y++) {
              grid[y][p1.x] = '#'
            }
          } else {// up
            for (var y = p2.y; y <= p1.y; y++) {
              grid[y][p1.x] = '#'
            }
          }
        } else {// horizontal
          if (p1.x < p2.x) {// right
            for (var x = p1.x; x <= p2.x; x++) {
              grid[p1.y][x] = '#'
            }
          } else {// left
            for (var x = p2.x; x <= p1.x; x++) {
              grid[p1.y][x] = '#'
            }
          }
        }
        if (p1.y > floor) {
          floor = p1.y
        }
        if (p2.y > floor) {
          floor = p2.y
        }
      }
    })
    // printGrid()
    floor += 2
    // console.log(floor)
    // part 2 fill floor
    for (var x = minX; x < maxX; x++) {
      grid[floor][x] = '#'
    }

    // sand simulation
    var prevSandCount = -1
    var sandCount = 0
    var timeout = 100000
    while (timeout-- > 0 && sandCount !== prevSandCount) {
      prevSandCount = sandCount
      var sand = {x:500,y:0} // create new sand
      var prevSandY = -1
      var sandTimeout = 1000
      // drop sand
      while (sandTimeout-- > 0 && sand.y !== prevSandY) {
        prevSandY = sand.y
        if (canDropDown(sand)) {
          sand.y++
        } else if (canDropDownLeft(sand)) {
          sand.y++
          sand.x--
        } else if (canDropDownRight(sand)) {
          sand.y++
          sand.x++
        } else if (canRest(sand)) { // rest
          grid[sand.y][sand.x] = 'o'
          sandCount++
        } else {
          // just do nothing
        }
      }
      if (sandTimeout < 0) console.log('sand timeout!')
    }
    if (timeout < 0) console.log('timeout!')

    // printGrid()
    const result = sandCount
    // 27566
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

/* puzzle
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
................................................................................
..........................................#.....................................
........................................#.#.....................................
........................................#.#.#...................................
........................................#.#.#...................................
....................................#...#.#.#...................................
....................................#...#.#.#...................................
....................................#...#.#.#...................................
....................................#.#.#.#.#...................................
....................................#.#.#.#.#...................................
..................................#.#.#.#.#.#...................................
..................................###########...................................
................................................................................
................................................................................
...............................#####............................................
................................................................................
............................#####.#####.........................................
................................................................................
.........................#####.#####.#####......................................
................................................................................
......................#####.#####.#####.#####...................................
................................................................................
...................#####.#####.#####.#####.#####................................
................................................................................
................................................................................
........#.#.........#...........................................................
........#.#.........#.....#.....................................................
........#.#...#.....#.....#.....................................................
........#.#...#.....#.#...#.....................................................
........#.#.#.#.....#.#...#.....................................................
........#.#.#.#.....#.#.#.#.....................................................
........#.#.#.#.....#.#.#.#.....................................................
........#.#.#.#.#...#.#.#.#.....................................................
........#.#.#.#.#.#.#.#.#.#.....................................................
........#.#.#.#.#.#.#.#.#.#.....................................................
........###################.....................................................
................................................................................
................................................................................
...............................................#...#............................
...............................................#...#............................
...............................................#...#............................
.........................................#######...######.......................
.........................................#..............#.......................
.........................................#..............#.......................
.........................................#..............#.......................
.........................................#..............#.......................
.........................................#..............#.......................
.........................................################.......................
................................................................................
................................................................................
.......................................#...#....................................
.......................................#...#....................................
.......................................#...#....................................
.......................................#...#....................................
...................................#####...########.............................
...................................#..............#.............................
...................................#..............#.............................
...................................#..............#.............................
...................................################.............................
................................................................................
................................................................................
................................................................................
................................................................................
...........................#...........#........................................
...........................#############........................................
................................................................................
................................................................................
........................#####...................................................
................................................................................
................................................................................
.....................#####.#####................................................
................................................................................
................................................................................
..................#####.#####.#####.............................................
................................................................................
................................................................................
...............#####.#####.#####.#####..........................................
................................................................................
................................................................................
............#####.#####.#####.#####.#####.......................................
................................................................................
................................................................................
................................................................................
................................................................................
..........#.....#...............................................................
........#.#.....#.#.............................................................
....#...#.#.....#.#.............................................................
..#.#...#.#.#...#.#.............................................................
..#.#...#.#.#.#.#.#.............................................................
..#.#...#.#.#.#.#.#.............................................................
..#.#.#.#.#.#.#.#.#.............................................................
..#.#.#.#.#.#.#.#.#.............................................................
..#################.............................................................
................................................................................
................................................................................
................................................................................
................................................................................
............#...............#...................................................
............#################...................................................
................................................................................
................................................................................
..........................######................................................
................................................................................
.......................######.######............................................
................................................................................
....................######.######.######........................................
................................................................................
.................######.######.######.######....................................
................................................................................
......................................#..........#..............................
......................................############..............................
................................................................................
................................................................................
...............................................#.....#..........................
...............................................#.....#..........................
.............................................###.....##.........................
.............................................#........#.........................
.............................................#........#.........................
.............................................#........#.........................
.............................................#........#.........................
.............................................#........#.........................
.............................................#........#.........................
.............................................##########.........................
................................................................................
................................................................................
....................................................###########.................
................................................................................
................................................................................
...........................................................#.#..................
...........................................................#.#.#................
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#.#.#.#..............
...........................................................#######..............
................................................................................
................................................................................
................................................................#####...........
................................................................................
................................................................................
.............................................................#####.#####........
................................................................................
................................................................................
..........................................................#####.#####.#####.....
................................................................................
................................................................................
......................................................#....#....................
......................................................#....#....................
......................................................#....#....................
.....................................................##....########.............
.....................................................#............#.............
.....................................................#............#.............
.....................................................#............#.............
.....................................................#............#.............
.....................................................#............#.............
.....................................................##############.............
................................................................................
................................................................................
................................................................................
*/