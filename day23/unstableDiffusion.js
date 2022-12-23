var input = [
`.....
..##.
..#..
.....
..##.
.....`,
`....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`
 ,puzzleInput
]

var grid
const directions = ['N','S','W','E']

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    grid = []
    var rowStrings = input[i].split(/\n+/)
    const offsetY = rowStrings.length
    const offsetX = rowStrings[0].length
    for (var r = 0; r < rowStrings.length; r++) {
      grid[r+offsetY] = []
      $.each(rowStrings[r].split(''),(idx,val)=>{
        grid[r+offsetY][idx+offsetX] = val
      })
    }
    // console.log(grid)

    var top = offsetY
    var bottom = offsetY + offsetY-1
    var left = offsetX
    var right = offsetX + offsetX-1
    // printGrid(top,bottom,left,right)

    var elves = []
    var id = 0
    for (var y = top; y <= bottom; y++) {
      for (var x = left; x <= right; x++) {
        if(grid[y][x] === '#') {
          elves[id] = {
            id:id,
            x:x,
            y:y
          }
          id++
        }
      }
    }
    // console.log(elves)

    // reset boundaries to edge elves
    top = elves[0].y
    bottom = elves[0].y
    left = elves[0].x
    right = elves[0].x

    var turn = 0
    const maxTurns = 10
    var dOff = 0

    while (turn++ < maxTurns) {
      //expand grid edges
      $.each(elves,(idx,e)=>{ // find edge elves
        if (e.y < top) {
          top = e.y
        }
        if (e.y > bottom) {
          bottom = e.y
        }
        if (e.x < left) {
          left = e.x
        }
        if (e.x > right) {
          right = e.x
        }
      })
      //top row
      if (grid[top-1] === undefined) {
        grid[top-1] = []
      }
      for (var x = left-1; x <= right+1; x++) {
        grid[top-1][x] = '.'
      }
      //bot row
      if (grid[bottom+1] === undefined) {
        grid[bottom+1] = []
      }
      for (var x = left-1; x <= right+1; x++) {
        grid[bottom+1][x] = '.'
      }
      //left and right cols
      for (var y = top-1; y <= bottom+1; y++) {
        grid[y][left-1] = '.'
        grid[y][right+1] = '.'
      }
      // printGrid(top-1,bottom+1,left-1,right+1)

      //scan
      var scan = []
      for (var e = 0; e < elves.length; e++) {
        var countN = 0
        var countS = 0
        var countW = 0
        var countE = 0
        const ey = elves[e].y
        const ex = elves[e].x
        if (grid[ey-1][ex-1]==='#') {//NW
          countN++
          countW++
        }
        if (grid[ey-1][ex]==='#') {//N
          countN++
        }
        if (grid[ey-1][ex+1]==='#') {//NE
          countN++
          countE++
        }
        if (grid[ey+1][ex-1]==='#') {//SW
          countS++
          countW++
        }
        if (grid[ey+1][ex]==='#') {//S
          countS++
        }
        if (grid[ey+1][ex+1]==='#') {//SE
          countS++
          countE++
        }
        if (grid[ey][ex-1]==='#') {//W
          countW++
        }
        if (grid[ey][ex+1]==='#') {//E
          countE++
        }
        scan[e] = {
          N:countN,
          S:countS,
          W:countW,
          E:countE,
          total: countN+countS+countW+countE
        }
      }

      //propose
      var dIdx = 0
      var proposed = {}
      var nextMoves = []
      for (var e = 0; e < elves.length; e++) {
        if (scan[e].total === 0) {
          nextMoves[e] = {y:elves[e].y,x:elves[e].x}
          const key = elves[e].y+','+elves[e].x
          proposed[key] = 1
          continue
        } // else
        dIdx = 0
        var canMove = false
        while (!canMove && dIdx < directions.length) {
          const dir = directions[(dIdx + dOff) % directions.length]
          if (dir === 'N') {
            if (scan[e].N === 0) {
              nextMoves[e] = {y:(elves[e].y-1),x:elves[e].x}
              const key = (elves[e].y-1)+','+elves[e].x
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'S') {
            if (scan[e].S === 0) {
              nextMoves[e] = {y:(elves[e].y+1),x:elves[e].x}
              const key = (elves[e].y+1)+','+elves[e].x
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'W') {
            if (scan[e].W === 0) {
              nextMoves[e] = {y:elves[e].y,x:(elves[e].x-1)}
              const key = elves[e].y+','+(elves[e].x-1)
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'E') {
            if (scan[e].E === 0) {
              nextMoves[e] = {y:elves[e].y,x:(elves[e].x+1)}
              const key = elves[e].y+','+(elves[e].x+1)
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else {
            console.log('errou a direção!')
          }
        }
        if (!canMove) {
          nextMoves[e] = {y:elves[e].y,x:elves[e].x}
          const key = elves[e].y+','+elves[e].x
          if (proposed[key] === undefined) {
            proposed[key] = 1
          } else {
            console.log('não deveria ocorrer')
            proposed[key]++
          }
        }
      }

      //move
      for (var e = 0; e < elves.length; e++) {
        const next = nextMoves[e]
        const key = next.y+','+next.x
        if (proposed[key] === 1) {
          grid[elves[e].y][elves[e].x] = '.'
          elves[e].y = next.y
          elves[e].x = next.x
          grid[elves[e].y][elves[e].x] = '#'
        }
      }

      dOff = (dOff+1) % directions.length
      // printGrid(top,bottom,left,right)
    }

    // printGrid(top,bottom,left,right+1)

    var emptyCount = 0
    for (var y = top; y <= bottom; y++) {
      for (var x = left; x <= right+1; x++) {
        emptyCount += grid[y][x] === '.' ? 1 : 0
      }
    }

    const result = emptyCount
    // 3987
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var printGrid = function(yStart,yEnd,xStart,xEnd) {
  var str = ''
  for (var y = yStart; y <= yEnd; y++) {
    for (var x = xStart; x <= xEnd; x++) {
      str += grid[y][x]
    }
    str += '\n'
  }
  console.log(str)
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    grid = []
    var rowStrings = input[i].split(/\n+/)
    const offsetY = rowStrings.length
    const offsetX = rowStrings[0].length
    for (var r = 0; r < rowStrings.length; r++) {
      grid[r+offsetY] = []
      $.each(rowStrings[r].split(''),(idx,val)=>{
        grid[r+offsetY][idx+offsetX] = val
      })
    }
    // console.log(grid)

    var top = offsetY
    var bottom = offsetY + offsetY-1
    var left = offsetX
    var right = offsetX + offsetX-1
    // printGrid(top,bottom,left,right)

    var elves = []
    var id = 0
    for (var y = top; y <= bottom; y++) {
      for (var x = left; x <= right; x++) {
        if(grid[y][x] === '#') {
          elves[id] = {
            id:id,
            x:x,
            y:y
          }
          id++
        }
      }
    }
    // console.log(elves)

    // reset boundaries to edge elves
    top = elves[0].y
    bottom = elves[0].y
    left = elves[0].x
    right = elves[0].x

    var turn = 0
    const maxTurns = 10000
    var dOff = 0

    while (turn++ < maxTurns) {
      //expand grid edges
      $.each(elves,(idx,e)=>{ // find edge elves
        if (e.y < top) {
          top = e.y
        }
        if (e.y > bottom) {
          bottom = e.y
        }
        if (e.x < left) {
          left = e.x
        }
        if (e.x > right) {
          right = e.x
        }
      })
      //top row
      if (grid[top-1] === undefined) {
        grid[top-1] = []
      }
      for (var x = left-1; x <= right+1; x++) {
        grid[top-1][x] = '.'
      }
      //bot row
      if (grid[bottom+1] === undefined) {
        grid[bottom+1] = []
      }
      for (var x = left-1; x <= right+1; x++) {
        grid[bottom+1][x] = '.'
      }
      //left and right cols
      for (var y = top-1; y <= bottom+1; y++) {
        grid[y][left-1] = '.'
        grid[y][right+1] = '.'
      }
      // printGrid(top-1,bottom+1,left-1,right+1)

      //scan
      var scan = []
      for (var e = 0; e < elves.length; e++) {
        var countN = 0
        var countS = 0
        var countW = 0
        var countE = 0
        const ey = elves[e].y
        const ex = elves[e].x
        if (grid[ey-1][ex-1]==='#') {//NW
          countN++
          countW++
        }
        if (grid[ey-1][ex]==='#') {//N
          countN++
        }
        if (grid[ey-1][ex+1]==='#') {//NE
          countN++
          countE++
        }
        if (grid[ey+1][ex-1]==='#') {//SW
          countS++
          countW++
        }
        if (grid[ey+1][ex]==='#') {//S
          countS++
        }
        if (grid[ey+1][ex+1]==='#') {//SE
          countS++
          countE++
        }
        if (grid[ey][ex-1]==='#') {//W
          countW++
        }
        if (grid[ey][ex+1]==='#') {//E
          countE++
        }
        scan[e] = {
          N:countN,
          S:countS,
          W:countW,
          E:countE,
          total: countN+countS+countW+countE
        }
      }

      //propose
      var dIdx = 0
      var proposed = {}
      var nextMoves = []
      var wontMove = 0
      for (var e = 0; e < elves.length; e++) {
        if (scan[e].total === 0) {
          nextMoves[e] = {y:elves[e].y,x:elves[e].x}
          const key = elves[e].y+','+elves[e].x
          proposed[key] = 1
          wontMove++
          continue
        } // else
        dIdx = 0
        var canMove = false
        while (!canMove && dIdx < directions.length) {
          const dir = directions[(dIdx + dOff) % directions.length]
          if (dir === 'N') {
            if (scan[e].N === 0) {
              nextMoves[e] = {y:(elves[e].y-1),x:elves[e].x}
              const key = (elves[e].y-1)+','+elves[e].x
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'S') {
            if (scan[e].S === 0) {
              nextMoves[e] = {y:(elves[e].y+1),x:elves[e].x}
              const key = (elves[e].y+1)+','+elves[e].x
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'W') {
            if (scan[e].W === 0) {
              nextMoves[e] = {y:elves[e].y,x:(elves[e].x-1)}
              const key = elves[e].y+','+(elves[e].x-1)
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else if (dir === 'E') {
            if (scan[e].E === 0) {
              nextMoves[e] = {y:elves[e].y,x:(elves[e].x+1)}
              const key = elves[e].y+','+(elves[e].x+1)
              if (proposed[key] === undefined) {
                proposed[key] = 1
              } else {
                proposed[key]++
              }
              canMove = true
            } else {
              dIdx++
            }
          } else {
            console.log('errou a direção!')
          }
        }
        if (!canMove) {
          nextMoves[e] = {y:elves[e].y,x:elves[e].x}
          const key = elves[e].y+','+elves[e].x
          if (proposed[key] === undefined) {
            proposed[key] = 1
          } else {
            console.log('não deveria ocorrer')
            proposed[key]++
          }
        }
      }
      if (wontMove === elves.length) {
        break
      }

      //move
      for (var e = 0; e < elves.length; e++) {
        const next = nextMoves[e]
        const key = next.y+','+next.x
        if (proposed[key] === 1) {
          grid[elves[e].y][elves[e].x] = '.'
          elves[e].y = next.y
          elves[e].x = next.x
          grid[elves[e].y][elves[e].x] = '#'
        }
      }

      dOff = (dOff+1) % directions.length
      // printGrid(top,bottom,left,right)
    }

    // printGrid(top,bottom,left,right+1)


    const result = turn
    // 938
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
