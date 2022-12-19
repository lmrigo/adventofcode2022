var input = [
`1,1,1
2,1,1`, // -- -- .
`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5` // +--+ +--+ + , where one of the + has a hole in the middle
 ,puzzleInput // it's some kind of a sphere shape
]

var grid3d
var maxX=-1
var maxY=-1
var maxZ=-1

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var points = $.map(numberStrings, (val => {
      const nums = val.split(',')
      var numsArr = $.map(nums, (n => {
        return Number(n)
      }))
      if (numsArr[0] > maxX) {
        maxX = numsArr[0]
      }
      if (numsArr[1] > maxY) {
        maxY = numsArr[1]
      }
      if (numsArr[2] > maxZ) {
        maxZ = numsArr[2]
      }
      return {
        x: numsArr[0],
        y: numsArr[1],
        z: numsArr[2]
      }
    }))
    const cubeWidth = 1
    maxX += 1 + cubeWidth
    maxY += 1 + cubeWidth
    maxZ += 1 + cubeWidth
    resetGrid()
    // console.log(points)

    // fill cubes
    $.each(points,(idx,p)=>{
      grid3d[p.x][p.y][p.z] = '#'
    })

    var faces = 0
    $.each(points,(idx,p)=> {
      //count empty nighbours
      if (grid3d[p.x+1][p.y][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x-1][p.y][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y+1][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y-1][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y][p.z+1] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y][p.z-1] === '.') {
        faces++
      }
    })


    const result = faces
    // 4460
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var resetGrid = function(emptyChar = '.') {
  grid3d = []
  for (var x = 0; x < maxX; x++) {
    grid3d[x] = []
    for (var y = 0; y < maxY; y++) {
      grid3d[x][y] = []
      for (var z = 0; z < maxZ; z++) {
        grid3d[x][y][z] = emptyChar
      }
    }
  }
}

var outside
var wall

var part2 = function () {
  maxX=maxY=maxZ=0

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var points = $.map(numberStrings, (val => {
      const nums = val.split(',')
      var numsArr = $.map(nums, (n => {
        return Number(n)
      }))
      if (numsArr[0] > maxX) {
        maxX = numsArr[0]
      }
      if (numsArr[1] > maxY) {
        maxY = numsArr[1]
      }
      if (numsArr[2] > maxZ) {
        maxZ = numsArr[2]
      }
      return {
        x: numsArr[0],
        y: numsArr[1],
        z: numsArr[2]
      }
    }))
    const cubeWidth = 1
    maxX += 1 + cubeWidth
    maxY += 1 + cubeWidth
    maxZ += 1 + cubeWidth
    resetGrid('_')
    // console.log(points)

    // fill cubes
    $.each(points,(idx,p)=>{
      grid3d[p.x][p.y][p.z] = '#'
    })

    // fill interior
    // xy Plane
    for (var z = 0; z < maxZ; z++) {
      for (var x = 0; x < maxX; x++) {
        var left = -1
        var y = 0
        while (y < maxY && left < 0) {
          if (grid3d[x][y][z] === '#') {
            left = y
          } else {
            if (grid3d[x][y][z] === '_') {
              grid3d[x][y][z] = '.'
            }
          }
          y++
        }
        if (left < 0) { // blank line
          continue
        }
        var right = -1
        y = maxY - 1
        while (y > left && right < 0) {
          if (grid3d[x][y][z] === '#') {
            right = y
          } else {
            if (grid3d[x][y][z] !== '#') {
              grid3d[x][y][z] = '.'
            }
          }
          y--
        }
        if (right < 0) { // single # line
          continue
        }
        for (var y = left; y < right; y++) {
          if (grid3d[x][y][z] === '_') {
            grid3d[x][y][z] = 'O'
          }
        }
      }
    }

    // xz Plane
    for (var y = 0; y < maxY; y++) {
      for (var z = 0; z < maxZ; z++) {
        var left = -1
        var x = 0
        while (x < maxX && left < 0) {
          if (grid3d[x][y][z] === '#') {
            left = x
          } else {
            if (grid3d[x][y][z] === '_') {
              grid3d[x][y][z] = '.'
            }
          }
          x++
        }
        if (left < 0) { // blank line
          continue
        }
        var right = -1
        x = maxX - 1
        while (x > left && right < 0) {
          if (grid3d[x][y][z] === '#') {
            right = x
          } else {
            if (grid3d[x][y][z] !== '#') {
              grid3d[x][y][z] = '.'
            }
          }
          x--
        }
        if (right < 0) { // single # line
          continue
        }
        for (var x = left; x < right; x++) {
          if (grid3d[x][y][z] === '_') {
            grid3d[x][y][z] = 'O'
          }
        }
      }
    }

    // yz Plane
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        var left = -1
        var z = 0
        while (z < maxZ && left < 0) {
          if (grid3d[x][y][z] === '#') {
            left = z
          } else {
            if (grid3d[x][y][z] === '_') {
              grid3d[x][y][z] = '.'
            }
          }
          z++
        }
        if (left < 0) { // blank line
          continue
        }
        var right = -1
        z = maxZ - 1
        while (z > left && right < 0) {
          if (grid3d[x][y][z] === '#') {
            right = z
          } else {
            if (grid3d[x][y][z] !== '#') {
              grid3d[x][y][z] = '.'
            }
          }
          z--
        }
        if (right < 0) { // single # line
          continue
        }
        for (var z = left; z < right; z++) {
          if (grid3d[x][y][z] === '_') {
            grid3d[x][y][z] = 'O'
          }
        }
      }
      printGridSliceX(x)
    }
    //TODO: not working because some cases like these:
    //  #
    //
    // #OO#
    //######

    var faces = 0
    $.each(points,(idx,p)=> {
      //count empty nighbours
      if (grid3d[p.x+1][p.y][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x-1][p.y][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y+1][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y-1][p.z] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y][p.z+1] === '.') {
        faces++
      }
      if (grid3d[p.x][p.y][p.z-1] === '.') {
        faces++
      }
    })

    const result = faces
    // 2241 too low
    // not 3672
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var printGridSliceX = function(x) {
  var str = ''
  for (var y = 0; y < maxY; y++) {
    for (var z = 0; z < maxZ; z++) {
      str += grid3d[x][y][z]
    }
    str +='\n'
  }
  console.log(str)
}

var printGridSliceZ = function(z) {
  var str = ''
  for (var x = 0; x < maxX; x++) {
    for (var y = 0; y < maxY; y++) {
      str += grid3d[x][y][z]
    }
    str +='\n'
  }
  console.log(str)
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})

/*
var fillInterior = function(x,y,z) {
  if (outside && grid3d[x][y][z] !== '#') { // still out
    grid3d[x][y][z] = '.'
  } else if (outside && grid3d[x][y][z] === '#') { // found wall
    outside = false // from out to in
    wall = true
  } else if (!outside && wall && grid3d[x][y][z] === '#') { // still going in
    // do nothing
  } else if (!outside && wall && grid3d[x][y][z] !== '#') { // entered in
    wall = false
    if (grid3d[x][y][z] === '_') {
      grid3d[x][y][z] = 'O'
    }
  } else if (!outside && !wall && grid3d[x][y][z] !== '#') { // still in
    if (grid3d[x][y][z] === '_') {
      grid3d[x][y][z] = 'O'
    }
  } else if (!outside && !wall && grid3d[x][y][z] === '#') { // found wall
    outside = true // from in to out
    wall = true
  } else if (outside && wall && grid3d[x][y][z] === '#') { // still going out
    // do nothing
  } else if (outside && wall && grid3d[x][y][z] !== '#') { // left out
    wall = false
    grid3d[x][y][z] = '.'
  } else if (outside && !wall && grid3d[x][y][z] !== '#') { // still out
    grid3d[x][y][z] = '.'
    console.log('acho que esse nunca vai acontecer')
  } else {
    console.log('faltou esse caso. out wall grid',outside,wall,grid3d[x][y][z])
  }
}
    // fill interior
    // xy Plane
    for (var z = 0; z < maxZ; z++) {
      for (var x = 0; x < maxX; x++) {
        outside = true
        wall = false
        for (var y = 0; y < maxY; y++) {
          fillInterior(x,y,z)
        }
      }
      // console.log(z)
      // printGridSliceZ(z)
    }
    // xy Plane backwards
    for (var z = maxZ - 1; z >= 0; z--) {
      for (var x = maxX - 1; x >= 0; x--) {
        outside = true
        wall = false
        for (var y = maxY - 1; y >= 0; y--) {
          fillInterior(x,y,z)
        }
      }
      // console.log(z)
      printGridSliceZ(z)
    }

    // xz Plane
    for (var y = 0; y < maxY; y++) {
      for (var x = 0; x < maxX; x++) {
        outside = true
        wall = false
        for (var z = 0; z < maxZ; z++) {
          fillInterior(x,y,z)
        }
      }
    }
    // xz Plane backwards
    for (var y = maxY - 1; y >= 0; y--) {
      for (var x = maxX - 1; x >= 0; x--) {
        outside = true
        wall = false
        for (var z = maxZ - 1; z >= 0; z--) {
          fillInterior(x,y,z)
        }
      }
    }

    // yz Plane
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        outside = true
        wall = false
        for (var z = 0; z < maxZ; z++) {
          fillInterior(x,y,z)
        }
      }
    }
    // yz Plane backwards
    for (var x = maxX - 1; x >= 0; x--) {
      for (var y = maxY - 1; y >= 0; y--) {
        outside = true
        wall = false
        for (var z = maxZ - 1; z >= 0; z--) {
          fillInterior(x,y,z)
        }
      }
    }

*/

/*

var genKey = function(point) {
  return point.x+'-'+point.y+'-'+point.z
}

var genNeighbours = function(p,searchedPoints) {
  var neighbours = []
  var n = null
  n = newPoint(p.x+1,p.y,p.z)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }
  n = newPoint(p.x-1,p.y,p.z)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }
  n = newPoint(p.x,p.y+1,p.z)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }
  n = newPoint(p.x,p.y-1,p.z)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }
  n = newPoint(p.x,p.y,p.z+1)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }
  n = newPoint(p.x,p.y,p.z-1)
  if (!searchedPoints[genKey(n)]) {
    neighbours.push(n)
  }

  return neighbours
}

var newPoint = function(x,y,z) {
  return {
    x:x,
    y:y,
    z:z
  }
}
    // start from a point
    // search neighbours
    // if neighbour is empty, add face
    // else continue search in the next neighbour

    const initialState = points[0]
    var searchedPoints = {}
    var nextStates = [initialState]
    var faces = 0

    var timeout = 50000
    while (timeout-- > 0 && nextStates.length > 0) {
      const st = nextStates.shift()
      const stKey = genKey(st)
      searchedPoints[stKey] = true
      var neighbours = genNeighbours(st,searchedPoints)
      $.each(neighbours,(idx,n) =>{
        if (grid3d[n.x][n.y][n.z] === '.') {
          faces++
        } else {
          const nKey = genKey(n)
          if (!searchedPoints[nKey]) {
            nextStates.push(n)
          }
        }
      })
      if (nextStates.length === 0
        && Object.keys(searchedPoints).length < points.length) {
        var found = false
        console.log('gap')
        while (!found) {
          for (var p = points.length - 1; p >= 0; p--) {
            const pkey = genKey(points[p])
            if (!searchedPoints[pkey]) {
              nextStates.push(points[p])
              found = true
              break
            }
          }
        }
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
    }
    console.log(Object.keys(searchedPoints).length,points.length)
*/

/*
    var xyPlane = []
    for (var z = 0; z < maxZ; z++) {
      for (var x = 0; x < maxX; x++) {
        if (!xyPlane[x]) {
          xyPlane[x] = []
        }
        for (var y = 0; y < maxY; y++) {
          if (!xyPlane[x][y]) {
            xyPlane[x][y] = 0
          }
          xyPlane[x][y] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('xyA',xyPlane)
    faces += xyPlane.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)

    var xyPlaneB = []
    for (var z = maxZ - 1; z >= 0; z--) {
      for (var x = 0; x < maxX; x++) {
        if (!xyPlaneB[x]) {
          xyPlaneB[x] = []
        }
        for (var y = 0; y < maxY; y++) {
          if (!xyPlaneB[x][y]) {
            xyPlaneB[x][y] = 0
          }
          xyPlaneB[x][y] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('xyB',xyPlaneB)
    faces += xyPlaneB.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)

    var xzPlane = []
    for (var y = 0; y < maxY; y++) {
      for (var x = 0; x < maxX; x++) {
        if (!xzPlane[x]) {
          xzPlane[x] = []
        }
        for (var z = 0; z < maxZ; z++) {
          if (!xzPlane[x][z]) {
            xzPlane[x][z] = 0
          }
          xzPlane[x][z] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('xzA',xzPlane)
    faces += xzPlane.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)

    var xzPlaneB = []
    for (var y = maxY - 1; y >= 0; y--) {
      for (var x = 0; x < maxX; x++) {
        if (!xzPlaneB[x]) {
          xzPlaneB[x] = []
        }
        for (var z = 0; z < maxZ; z++) {
          if (!xzPlaneB[x][z]) {
            xzPlaneB[x][z] = 0
          }
          xzPlaneB[x][z] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('xzB',xzPlaneB)
    faces += xzPlaneB.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)

    var yzPlane = []
    for (var x = 0; x < maxX; x++) {
      for (var y = 0; y < maxY; y++) {
        if (!yzPlane[y]) {
          yzPlane[y] = []
        }
        for (var z = 0; z < maxZ; z++) {
          if (!yzPlane[y][z]) {
            yzPlane[y][z] = 0
          }
          yzPlane[y][z] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('yzA',yzPlane)
    faces += yzPlane.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)

    var yzPlaneB = []
    for (var x = maxX - 1; x >= 0; x--) {
      for (var y = 0; y < maxY; y++) {
        if (!yzPlaneB[y]) {
          yzPlaneB[y] = []
        }
        for (var z = 0; z < maxZ; z++) {
          if (!yzPlaneB[y][z]) {
            yzPlaneB[y][z] = 0
          }
          yzPlaneB[y][z] += grid3d[x][y][z] === '.' ? 0 : 1
        }
      }
    }
    console.log('yzB',yzPlaneB)
    faces += yzPlaneB.reduce((acc,row) => {
      return acc + row.reduce((acc2,cell) => {
        return acc2 + (cell === 0 ? 0 : 1)
      },0)
    },0)
*/