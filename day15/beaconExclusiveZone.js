var input = [
`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`
 ,puzzleInput
]

var grid
var minX = Number.MAX_SAFE_INTEGER
var maxX = -1
var minY = Number.MAX_SAFE_INTEGER
var maxY = -1
var maxSS = -1
var resultRow

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
    resultRow = i === 0 ? 10 : 2000000
    var sbLinesStrings = input[i].split(/\n+/)

    var sensors = []
    var beacons = []
    $.each(sbLinesStrings, (idx,val) => {
      const words = val.split(/\,?\:?\s+/)
      //sensor
      const sensorX = Number(words[2].split('=')[1])
      if (sensorX < minX) {
        minX = sensorX
      }
      if (sensorX > maxX) {
        maxX = sensorX
      }
      const sensorY = Number(words[3].split('=')[1])
      if (sensorY < minY) {
        minY = sensorY
      }
      if (sensorY > maxY) {
        maxY = sensorY
      }
      //beacon
      const beaconX = Number(words[8].split('=')[1])
      if (beaconX < minX) {
        minX = beaconX
      }
      if (beaconX > maxX) {
        maxX = beaconX
      }
      const beaconY = Number(words[9].split('=')[1])
      if (beaconY < minY) {
        minY = beaconY
      }
      if (beaconY > maxY) {
        maxY = beaconY
      }
      //signal strength
      const signalStrength = Math.abs(sensorX-beaconX) + Math.abs(sensorY-beaconY)
      if (signalStrength > maxSS) {
        maxSS = signalStrength
      }
      //save points
      sensors.push({x:sensorX,y:sensorY,ss:signalStrength})
      beacons.push({x:beaconX,y:beaconY})
    })
    // add border
    const border = maxSS+1
    minX -= border
    maxX += border
    minY -= border
    maxY += border

    /*
    //fill grid with sensors and beacons
    resetGrid()
    for (var s = 0; s < sensors.length; s++) {
      grid[sensors[s].y][sensors[s].x] = 'S'
    }
    for (var b = 0; b < beacons.length; b++) {
      grid[beacons[b].y][beacons[b].x] = 'B'
    }

    //fill grid with signal strength
    $.each(sensors,(idx,s)=>{
      // top
      for (var ssY = -s.ss; ssY <= 0; ssY++) {
        for (var ssX = -s.ss-ssY; ssX <= s.ss+ssY; ssX++) {
          if (grid[s.y+ssY][s.x+ssX] === '.') {
            grid[s.y+ssY][s.x+ssX] = '#'
          }
        }
      }
      //bottom
      for (var ssY = 1; ssY <= s.ss; ssY++) {
        for (var ssX = s.ss-ssY; ssX >= -s.ss+ssY; ssX--) {
          if (grid[s.y+ssY][s.x+ssX] === '.') {
            grid[s.y+ssY][s.x+ssX] = '#'
          }
        }
      }
    })
    */

    //fill grid with sensors and beacons without 'reset' function
    // resetGrid()
    var grid = []
    // reset only resultRow
    grid[resultRow] = []
    for (var x = minX; x < maxX; x++) {
      grid[resultRow][x] = '.'
    }
    for (var s = 0; s < sensors.length; s++) {
      if (grid[sensors[s].y] === undefined) {
        grid[sensors[s].y] = []
      }
      grid[sensors[s].y][sensors[s].x] = 'S'
    }
    for (var b = 0; b < beacons.length; b++) {
      if (grid[beacons[b].y] === undefined) {
        grid[beacons[b].y] = []
      }
      grid[beacons[b].y][beacons[b].x] = 'B'
    }

    //fill only resultRow with signal
    for (var x = minX; x < maxX; x++) {
      var inRange = false
      $.each(sensors,(idx,s)=>{
        if (inSensorRange(resultRow,x,s)) {
          inRange = true
          return false // break foreach
        }
      })
      if (inRange && (grid[resultRow][x] === '.')) {
        grid[resultRow][x] = '#'
      }
    }

    // printGrid()

    var occupiedCount = 0
    for (var x = minX; x < maxX; x++) {
      if (grid[resultRow][x] === '#') {
        occupiedCount++
      }
    }

    const result = occupiedCount
    // 4827924
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var inSensorRange = function (y,x,sensor) {
  const distance = Math.abs(sensor.x-x) + Math.abs(sensor.y-y)
  return distance <= sensor.ss
}

const part2Constant = 4000000
var maxCoordinates

var part2 = function () {

  // look for a blank spot in the middle of the sensors area
  for (var i = 0; i < input.length-1; i++) {
    maxCoordinates = i === 0 ? 20 : part2Constant
    const minDistressBeaconX = 0
    const maxDistressBeaconX = maxCoordinates
    const minDistressBeaconY = 0
    const maxDistressBeaconY = maxCoordinates
    var sbLinesStrings = input[i].split(/\n+/)

    var sensors = []
    var beacons = []
    $.each(sbLinesStrings, (idx,val) => {
      const words = val.split(/\,?\:?\s+/)
      //sensor
      const sensorX = Number(words[2].split('=')[1])
      if (sensorX < minX) {
        minX = sensorX
      }
      if (sensorX > maxX) {
        maxX = sensorX
      }
      const sensorY = Number(words[3].split('=')[1])
      if (sensorY < minY) {
        minY = sensorY
      }
      if (sensorY > maxY) {
        maxY = sensorY
      }
      //beacon
      const beaconX = Number(words[8].split('=')[1])
      if (beaconX < minX) {
        minX = beaconX
      }
      if (beaconX > maxX) {
        maxX = beaconX
      }
      const beaconY = Number(words[9].split('=')[1])
      if (beaconY < minY) {
        minY = beaconY
      }
      if (beaconY > maxY) {
        maxY = beaconY
      }
      //signal strength
      const signalStrength = Math.abs(sensorX-beaconX) + Math.abs(sensorY-beaconY)
      if (signalStrength > maxSS) {
        maxSS = signalStrength
      }
      //save points
      sensors.push({x:sensorX,y:sensorY,ss:signalStrength})
      beacons.push({x:beaconX,y:beaconY})
    })
    // add border
    const border = 1
    minX -= border
    maxX += border
    minY -= border
    maxY += border

    var intervals = []

    //fill only resultRow with signal
    for (var y = minDistressBeaconY; y < maxDistressBeaconY; y++) {
      $.each(sensors,(idx,s)=>{
        // find if there's intersection between y and s.y
        var inter = intersection(s,y)
        // there can be only 1 or 2 intersections
        if (inter.length > 0) {
          // if yes, fill low x and high x
          //TODO: store intervals instead of marking in the grid
          if (intervals[y] === undefined) {
            intervals[y] = []
            intervals.push([inter[0],inter[1]])
          } else {
            // [--]
            // ----[--]

            // [--]
            // --[--]

            // [--]
            // [--]

            // --[--]
            // [--]

            // ----[--]
            // [--]

            // [----]
            // -[--]

            // -[--]
            // [----]

            if (inter[0] < intervals[y][0]) {
              const last = intervals[y].length-1
              if (inter[1] >= intervals[y][last][1]) {
                intervals[y] = [inter[0],inter[1]]
              } else if (inter[1] < intervals[]) {

              }

            }
          }

          // Then later search for the blank spot, line by line
        }
      })
    }

    for (var s = 0; s < sensors.length; s++) {
      grid[sensors[s].y][sensors[s].x] = 'S'
    }
    for (var b = 0; b < beacons.length; b++) {
      grid[beacons[b].y][beacons[b].x] = 'B'
    }
    printGrid()

    //calcFrequency()
    const result = 0
    // console.log(result)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

// it's an intersection between circle and line
var intersection = function(s, row) {
  var inter = []
  if (s.y-s.ss <= row && row <= s.y+s.ss) {
    var diff
    if (s.y < row) {
      diff = s.ss - (row-s.y)
    } else if (s.y > row) {
      diff = s.ss - (s.y-row)
    } else {// s.y === row
      diff = s.ss
      // will return 2 of the same kind
    }
    var left = s.x-diff
    var right = s.x+diff
    inter = [left,right]
  }
  return inter
}

var calcFrequency = function (x,y) {
  return (x*part2Constant) + y
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
