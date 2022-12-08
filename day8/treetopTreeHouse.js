var input = [
`30373
25512
65332
33549
35390`
 ,puzzleInput
]

var grid

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    grid = []
    var rowStrings = input[i].split(/\n+/)
    for (var j = 0; j < rowStrings.length; j++) {
      var colStrings = $.map(rowStrings[j].split(''), (val => {return Number(val)}))
      grid[j] = colStrings
    }
    //console.log(grid)
    var visibleCounter = 0
    for (var row = 0; row < grid.length; row++) {
      for (var col = 0; col < grid.length; col++) {
        if (isVisible(row, col) ) {
          visibleCounter++
        }
      }
    }

    var result = visibleCounter
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var isVisible = function (row, col) {
  if (row === 0 || col === 0
    || row === grid.length-1 || col === grid.length-1) {
    return true
  } else {
    // look for visibility in any of the four directions

    //search up
    var visibleNorth = true
    var r = row - 1
    while (r >= 0) {
      if (grid[r][col] >= grid[row][col]) {
        visibleNorth = false
        break
      }
      r--
    }
    if (visibleNorth) return true

    //search down
    var visibleSouth = true
    r = row + 1
    while (r < grid.length) {
      if (grid[r][col] >= grid[row][col]) {
        visibleSouth = false
        break
      }
      r++
    }
    if (visibleSouth) return true

    //search left
    var visibleWest = true
    var c = col - 1
    while (c >= 0) {
      if (grid[row][c] >= grid[row][col]) {
        visibleWest = false
        break
      }
      c--
    }
    if (visibleWest) return true

    //search right
    var visibleEast = true
    c = col + 1
    while (c < grid[row].length) {
      if (grid[row][c] >= grid[row][col]) {
        visibleEast = false
        break
      }
      c++
    }
    if (visibleEast) return true

    // if not visible in any direction
    return false
  }
}


var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    grid = []
    var rowStrings = input[i].split(/\n+/)
    for (var j = 0; j < rowStrings.length; j++) {
      var colStrings = $.map(rowStrings[j].split(''), (val => {return Number(val)}))
      grid[j] = colStrings
    }
    //console.log(grid)
    var highestScore = 0
    for (var row = 0; row < grid.length; row++) {
      for (var col = 0; col < grid.length; col++) {
        const ss = scenicScore(row, col)
        if (ss > highestScore) {
          highestScore = ss
        }
      }
    }

    var result = highestScore
    // console.log(result)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var scenicScore = function (row, col) {
  // calculate the Scenic Score in the four directions

  //search up
  var scoreNorth = 0
  var r = row - 1
  while (r >= 0) {
    if (grid[r][col] >= grid[row][col]) {
      scoreNorth++
      break
    }
    scoreNorth++
    r--
  }
  if (scoreNorth === 0) return 0

  //search down
  var scoreSouth = 0
  r = row + 1
  while (r < grid.length) {
    if (grid[r][col] >= grid[row][col]) {
      scoreSouth++
      break
    }
    scoreSouth++
    r++
  }
  if (scoreSouth === 0) return 0

  //search left
  var scoreWest = 0
  var c = col - 1
  while (c >= 0) {
    if (grid[row][c] >= grid[row][col]) {
      scoreWest++
      break
    }
    scoreWest++
    c--
  }
  if (scoreWest === 0) return 0

  //search right
  var scoreEast = 0
  c = col + 1
  while (c < grid[row].length) {
    if (grid[row][c] >= grid[row][col]) {
      scoreEast++
      break
    }
    scoreEast++
    c++
  }
  if (scoreEast === 0) return 0

  return scoreNorth * scoreSouth * scoreWest * scoreEast
}


$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
