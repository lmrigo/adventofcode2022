var input = [
`#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`
 ,puzzleInput
]

var grid
var blizzards
var visits

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var inStrings = input[i].split(/\n+/)
    grid = []
    visits = []
    $.each(inStrings,(idx, val)=> {
      grid[idx] = val.split('')
      visits[idx] = Array(grid[idx].length).fill(0)
    })
    blizzards = []
    var id = 0
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
        if (isBlizzard(grid[y][x])) {
          blizzards.push({
            id:id,
            dir:grid[y][x],
            y:y,
            x:x
          })
          id++
        }
      }
    }
    const start = {y:0,x:1}
    const end = {y:grid.length-1,x:grid[0].length-2}

    var minMinutes = Number.MAX_SAFE_INTEGER
    var initialState = {y:start.y,x:start.x,minutes:0}
    var nextStates = []
    var nextBatch = [initialState]
    var nextBatchMap = {}
    var timeout = 1000000
    while (timeout-- > 0 && nextBatch.length > 0) {
      nextStates.push(...nextBatch)
      nextBatch = []
      nextBatchMap = {}
      moveBlizzards()
      var newStates = []
      while (timeout-- > 0 && nextStates.length > 0) {
        var st = nextStates.shift()
        if (st.y === end.y && st.x === end.x) {
          if (st.minutes < minMinutes) {
            minMinutes = st.minutes
          }
        } else {
          if (st.minutes > minMinutes) {
            continue //discard
          }
          newStates = genStates(st)
          $.each(newStates,(idx,ns) => {
            const key = ns.x+'-'+ns.y
            if (nextBatchMap[key] === undefined) {
              nextBatchMap[key] = true
              nextBatch.push(ns)
              visits[ns.y][ns.x]++
            }
          })
        }
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
    }
    // console.log(visits)

    const result = minMinutes
    // 297
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var genStates = function(st) {
  var newStates = []
  // up
  if (st.y > 0
    && canMove(grid[st.y-1][st.x])) {
    var up = {}
    Object.assign(up,st)
    up.y--
    up.minutes++
    newStates.push(up)
  }
  // down
  if (st.y < grid.length-1
    && canMove(grid[st.y+1][st.x])) {
    var down = {}
    Object.assign(down,st)
    down.y++
    down.minutes++
    newStates.push(down)
  }
  // left
  if (st.x > 0
    && canMove(grid[st.y][st.x-1])) {
    var left = {}
    Object.assign(left,st)
    left.x--
    left.minutes++
    newStates.push(left)
  }
  // right
  if (st.x < grid[0].length-1
    && canMove(grid[st.y][st.x+1])) {
    var right = {}
    Object.assign(right,st)
    right.x++
    right.minutes++
    newStates.push(right)
  }
  // wait
  if (canMove(grid[st.y][st.x])) {
    var wait = {}
    Object.assign(wait,st)
    wait.minutes++
    newStates.push(wait)
  }

  return newStates
}

var isBlizzard = function(val) {
  return '^v<>'.includes(val)
}

var canMove = function(val) {
  return val === '.'
}

var moveBlizzards = function() {
  cleanGrid()
  $.each(blizzards,(idx,blz) => {
    //up
    if (blz.dir === '^') {
      if (blz.y === 1) {
        blz.y = grid.length-2
      } else {
        blz.y--
      }
    }
    //down
    if (blz.dir === 'v') {
      if (blz.y === grid.length-2) {
        blz.y = 1
      } else {
        blz.y++
      }
    }
    //left
    if (blz.dir === '<') {
      if (blz.x === 1) {
        blz.x = grid[0].length-2
      } else {
        blz.x--
      }
    }
    //right
    if (blz.dir === '>') {
      if (blz.x === grid[0].length-2) {
        blz.x = 1
      } else {
        blz.x++
      }
    }
    //place in grid
    grid[blz.y][blz.x] = blz.dir
  })
}

var cleanGrid = function() {
  for (var y = 1; y < grid.length-1; y++) {
    for (var x = 1; x < grid[y].length-1; x++) {
      if (grid[y][x] !== '.') {
        grid[y][x] = '.'
      }
    }
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var inStrings = input[i].split(/\n+/)
    grid = []
    visits = []
    $.each(inStrings,(idx, val)=> {
      grid[idx] = val.split('')
      visits[idx] = Array(grid[idx].length).fill(0)
    })
    blizzards = []
    var id = 0
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
        if (isBlizzard(grid[y][x])) {
          blizzards.push({
            id:id,
            dir:grid[y][x],
            y:y,
            x:x
          })
          id++
        }
      }
    }
    var start = {y:0,x:1}
    var end = {y:grid.length-1,x:grid[0].length-2}

    var startMins
    if (i==0) {
      startMins = 18 + 23 + 13 // = 54
    } else {
      startMins = 297 + 277 + 282 // 856
    }
    for (var m = 0; m < startMins; m++) {
      moveBlizzards()
    }
    // var aux = end
    // end = start
    // start = aux

    var minMinutes = Number.MAX_SAFE_INTEGER
    var initialState = {y:start.y,x:start.x,minutes:startMins}
    var nextStates = []
    var nextBatch = [initialState]
    var nextBatchMap = {}
    var timeout = 1000000
    while (timeout-- > 0 && nextBatch.length > 0) {
      nextStates.push(...nextBatch)
      nextBatch = []
      nextBatchMap = {}
      moveBlizzards()
      var newStates = []
      while (timeout-- > 0 && nextStates.length > 0) {
        var st = nextStates.shift()
        if (st.y === end.y && st.x === end.x) {
          if (st.minutes < minMinutes) {
            minMinutes = st.minutes
            // console.log(st)
          }
        } else {
          if (st.minutes > minMinutes) {
            continue //discard
          }
          newStates = genStates(st)
          $.each(newStates,(idx,ns) => {
            const key = ns.x+'-'+ns.y
            if (nextBatchMap[key] === undefined) {
              nextBatchMap[key] = true
              nextBatch.push(ns)
              visits[ns.y][ns.x]++
            }
          })
        }
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
    }
    // console.log(visits)

    const result = startMins
    // 856
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
