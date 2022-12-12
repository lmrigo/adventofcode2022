var input = [
`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
 ,puzzleInput
]

var grid
var bestStepsGrid

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var rowStrings = input[i].split(/\n+/)
    grid = $.map(rowStrings, (val => {return [val.split('')]}))
    bestStepsGrid = []
    // console.log(grid)
    var startX = undefined
    var startY = undefined
    var endX = undefined
    var endY = undefined
    for (var y = 0; y < grid.length; y++) {
      bestStepsGrid[y] = []
      for (var x = 0; x < grid[y].length; x++) {
        bestStepsGrid[y][x]=9999
        if (grid[y][x] === 'S') {
          startY = y
          startX = x
        } else if (grid[y][x] === 'E') {
          endY = y
          endX = x
        }
      }
    }
    grid[startY][startX] = 'a'
    grid[endY][endX] = '{' // '{' is one ASCII after 'z'
    // console.log(startX,startY,endX,endY)

    var bestSteps = Number.MAX_SAFE_INTEGER
    var initialState = {x:startX,y:startY,steps:0,history:{}}
    initialState.history[startX+','+startY] = true
    var timeout = 100000
    var states = [initialState]
    while(timeout-- > 0 && states.length > 0) {
      var st = states.shift()
      if (st.steps >= bestStepsGrid[st.y][st.x]) {
       continue
      } else {
         bestStepsGrid[st.y][st.x] = st.steps
      }
      if(st.x === endX && st.y === endY) {
        bestSteps = bestSteps > st.steps ? st.steps : bestSteps
      } else { // generate next states
        states.push(...generateStates(st))
      }
    }
    if (timeout <= 0) console.log('timeout!!!')
    // printGrid()

    const result = bestSteps
    // 456
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var generateStates = function(state,backwards = false) {
  var newStates = []
  //up
  if (state.y > 0
    && state.history[state.x+','+state.y-1] !== true
    && canStep(grid[state.y][state.x],grid[state.y-1][state.x],backwards)) {
    var upState = {
      x:state.x,
      y:state.y-1,
      steps:state.steps+1,
      history:{}
    }
    Object.assign(upState.history, state.history);
    upState.history[upState.x+','+upState.y] = true
    newStates.push(upState)
  }
  //down
  if (state.y < grid.length-1
    && state.history[state.x+','+state.y+1] !== true
    && canStep(grid[state.y][state.x],grid[state.y+1][state.x],backwards)) {
    var downState = {
      x:state.x,
      y:state.y+1,
      steps:state.steps+1,
      history:{}
    }
    Object.assign(downState.history, state.history);
    downState.history[downState.x+','+downState.y] = true
    newStates.push(downState)
  }
  //left
  if (state.x > 0
    && state.history[state.x-1+','+state.y] !== true
    && canStep(grid[state.y][state.x],grid[state.y][state.x-1],backwards)) {
    var leftState = {
      x:state.x-1,
      y:state.y,
      steps:state.steps+1,
      history:{}
    }
    Object.assign(leftState.history, state.history);
    leftState.history[leftState.x+','+leftState.y] = true
    newStates.push(leftState)
  }
  //right
  if (state.x < grid[0].length-1
    && state.history[state.x+1+','+state.y] !== true
    && canStep(grid[state.y][state.x],grid[state.y][state.x+1],backwards)) {
    var rightState = {
      x:state.x+1,
      y:state.y,
      steps:state.steps+1,
      history:{}
    }
    Object.assign(rightState.history, state.history);
    rightState.history[rightState.x+','+rightState.y] = true
    newStates.push(rightState)
  }
  return newStates
}

var canStep = function(src,dest,backwards) {
  if (backwards) {
    return dest.charCodeAt() - src.charCodeAt() >= -1
  }
  // check height difference. 1 higher or any lower
  return dest.charCodeAt() - src.charCodeAt() <= 1
}

var printGrid = function() {
  var str = ''
  for (var y = 0; y < grid.length; y++) {
    for (var x = 0; x < grid[y].length; x++) {
      if (bestStepsGrid[y][x]===9999) {
        str += grid[y][x]
      } else {
        str += '*'
      }
    }
    str += '\n'
  }
  console.log(str)
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var rowStrings = input[i].split(/\n+/)
    grid = $.map(rowStrings, (val => {return [val.split('')]}))
    bestStepsGrid = []
    // console.log(grid)
    var startX = undefined
    var startY = undefined
    var endX = undefined
    var endY = undefined
    for (var y = 0; y < grid.length; y++) {
      bestStepsGrid[y] = []
      for (var x = 0; x < grid[y].length; x++) {
        bestStepsGrid[y][x]=9999
        // Part 2 it's better to switch start and end
        if (grid[y][x] === 'E') {
          startY = y
          startX = x
        } else if (grid[y][x] === 'S') {
          endY = y
          endX = x
        }
      }
    }
    grid[startY][startX] = '{' // '{' is one ASCII after 'z'
    grid[endY][endX] = 'a'
    // console.log(startX,startY,endX,endY)

    var bestSteps = Number.MAX_SAFE_INTEGER
    var initialState = {x:startX,y:startY,steps:0,history:{}}
    initialState.history[startX+','+startY] = true
    var timeout = 100000
    var states = [initialState]
    while(timeout-- > 0 && states.length > 0) {
      var st = states.shift()
      if (st.steps >= bestStepsGrid[st.y][st.x]) {
       continue
      } else {
         bestStepsGrid[st.y][st.x] = st.steps
      }
      if(st.x === endX && st.y === endY) {
        bestSteps = bestSteps > st.steps ? st.steps : bestSteps
      } else { // generate next states
        states.push(...generateStates(st,true))
      }
    }
    if (timeout <= 0) console.log('timeout!!!')
    // printGrid()

    var bestA = 9999
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'a') {
          if (bestStepsGrid[y][x] < bestA) {
            bestA = bestStepsGrid[y][x]
          }
        }
      }
    }

    const result = bestA
    // 454
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
