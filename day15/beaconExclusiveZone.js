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
    str += y+''
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
    grid = [] //comment if the 'fill grid' section is uncommented
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
  for (var i = 0; i < input.length; i++) {
    maxCoordinates = i === 0 ? 20 : part2Constant
    const minDistressBeaconX = 0
    const maxDistressBeaconX = maxCoordinates
    const minDistressBeaconY = 0
    const maxDistressBeaconY = maxCoordinates
    var minSensorSSY = Number.MAX_SAFE_INTEGER
    var maxSensorSSY = -1
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


      if ((sensorY-signalStrength) < minSensorSSY) {
        minSensorSSY = (sensorY-signalStrength)
      }
      if ((sensorY+signalStrength) > maxSensorSSY) {
        maxSensorSSY = (sensorY+signalStrength)
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

    //store intervals instead of marking in the grid
    var blankX = undefined
    var blankY = undefined

    //limit iteration
    // from (minSensorY - its signalStrength) to (maxSensorY + its signalStrenght)
    const lowY = minDistressBeaconY > minSensorSSY ? minDistressBeaconY : minSensorSSY
    const highY = maxDistressBeaconY < maxSensorSSY ? maxDistressBeaconY : maxSensorSSY

    var intervals = []
    //fill only resultRow with signal
    for (var y = lowY; y <= highY; y++) {
      var minInterX = Number.MAX_SAFE_INTEGER
      var maxInterX = -1
      intervals = []
      $.each(sensors,(idx,s)=>{
        // find if there's intersection between y and s.y
        var inter = intersection(s,y)
        // if yes, store in intersections
        if (inter.length > 0) {
          intervals.push(inter)
          if (inter[0] < minInterX) {
            minInterX = inter[0]
          }
          if (inter[1] > maxInterX) {
            maxInterX = inter[1]
          }
        }
      })

      // After the row is filled, search for the blank spot

      // Merge all intervals
      intervals = mergeIntervals(intervals)

      // If there's more than one interval, check if it's a single blank spot
      if (intervals.length > 1) {
        intervals.sort((a,b) => {
          return a[0]-b[0]
        })
        // console.log(y,intervals)
        //check blanks spots
        for (var a = 0; a < intervals.length-1; a++) {
          const b = a+1
          if (intervals[b][0] - intervals[a][1] === 2) {
            //candidate
            // console.log(pairToString(intervals[a]) + ' and ' + pairToString(intervals[b]))
            const x = intervals[a][1] + 1
            //check if the spot is really blank
            // if yes, check if top and bottom are closed
            const spot = {y:y,x:x}
            var spotFree = true
            const top = {y:y-1,x:x}
            var foundTop = false
            const bottom = {y:y+1,x:x}
            var foundBottom = false
            $.each(sensors,(idxs,s2)=>{
              if (spotFree && (s2.x === spot.x && s2.y === spot.y)) {
                spotFree = false
                return false
              }
              if (!foundTop && inSensorRange(top.y,top.x,s2)) {
                foundTop = true
              }
              if (!foundBottom && inSensorRange(bottom.y,bottom.x,s2)) {
                foundBottom = true
              }
              if (foundTop && foundBottom) {
                return false // break foreach
              }
            })

            if (foundTop && foundBottom && spotFree) {
              blankX = x
              blankY = y
              // console.log('answer: ',blankX,blankY)
              break
            }
          }
        }
      }

      if (blankX !== undefined) {
        break
      }
    }

    const result = calcFrequency(blankX,blankY)
    // 12977110973564
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var mergeIntervals = function(srcIntervals) {
  if (srcIntervals.length < 2) {
    return srcIntervals
  }
  var intervals = [...srcIntervals]
  var tested = []
  var testCount = 0

  var timeout = 10000
  while (intervals.length > 1
        && testCount < intervals.length
        && timeout-- > 0) {

    var reference
    for (var n = 0; n < intervals.length; n++) {
      if (!tested.includes(pairToString(intervals[n]))) {
        reference = intervals[n]
        tested.push(pairToString(reference))
        break
      } else {
        testCount++
      }
    }

    var newIntervals = []
    var refMerged = false
    $.each(intervals,(idx,val) => {
      var merged = compareIntervals(reference,val)
      if (merged.length > 0) {
        if (newIntervals.find((x) => {
              return x[0]===merged[0] && x[1] === merged[1]
            }) === undefined) {
          newIntervals.push(merged)
        }
      } else {
        if (newIntervals.find((x) => {
              return x[0]===val[0] && x[1] === val[1]
            }) === undefined) {
          newIntervals.push(val)
        }
      }
    })
    if (!refMerged
      && newIntervals.find((x) => {
              return x[0]===reference[0] && x[1] === reference[1]
            }) === undefined) {
      newIntervals.push(reference)
    }

    // if there was a change
    if (intervalsToString(intervals) !== intervalsToString(newIntervals)) {
      tested = []
      testCount = 0
    }

    intervals = [...newIntervals]
  }

  return intervals
}

var compareIntervals = function(a,b) {
  var newInter
  // [--]-
  // -----[--]
  if (a[1]<b[0]) {
    newInter = []
  // [--]--  [--]-
  // ---[--] ---|-
  } else if (a[0]<b[0] && a[1]===b[0]) {
    newInter = [a[0],b[1]]
  // [--]--
  // --[--]
  } else if (a[0]<b[0] && a[1]>b[0] && a[1]<b[1]) {
    newInter = [a[0],b[1]]
  // [--]  -|-
  // [--]  -|-
  } else if (a[0]===b[0] && a[1]===b[1]) {
    newInter = a
  // --[--]
  // [--]--
  } else if (a[0]>b[0] && a[0]<b[1] && a[1]>b[1]) {
    newInter = [b[0],a[1]]
  // ---[--] ---|
  // [--]--  [--]
  } else if (a[0]>b[0] && a[0]===b[1]) {
    newInter = [b[0],a[1]]
  // -----[--]
  // [--]-
  } else if (a[0] > b[1]) {
    newInter = []
  // [----]
  // -[--]-
  } else if (a[0]<b[0] && a[1]>b[1]) {
    newInter = a
  // -[--]-
  // [----]
  } else if (a[0]>b[0] && a[1]<b[1]) {
    newInter = b
  // [--]-
  // [---]
  } else if (a[0]==b[0] && a[1]<b[1]) {
    newInter = b
  // [---]
  // [--]-
  } else if (a[0]==b[0] && a[1]>b[1]) {
    newInter = a
  // [---]
  // -[--]
  } else if (a[0]<b[0] && a[1]==b[1]) {
    newInter = a
  // -[--]
  // [---]
  } else if (a[0]>b[0] && a[1]==b[1]) {
    newInter = b
  } else {
    console.log('faltou esse caso: '+a[0]+'-'+a[1]+'  '+b[0]+'-'+b[1])
  }
  return newInter
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

var pairToString = function(pair) {
  return pair[0] + '-' + pair[1]
}

var intervalsToString = function(intervals) {
  var str = ''
  for (var i = 0; i < intervals.length; i++) {
    str += pairToString(intervals[i]) + ','
  }
  return str
}

var calcFrequency = function(x,y) {
  return (x*part2Constant) + y
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
