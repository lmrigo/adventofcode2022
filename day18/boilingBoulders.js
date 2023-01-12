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
    resetGrid('.')
    // console.log(points)

    // fill cubes
    $.each(points,(idx,p)=>{
      grid3d[p.x][p.y][p.z] = '#'
    })

    // starting from outside,
    // walk through the empty spaces
    // and count faces
    var initialPoint = {x:0,y:0,z:0}
    var nextPoints = [initialPoint]
    var totalFaces = 0
    var timeout = 100000
    while (timeout-- > 0 && nextPoints.length > 0) {
      var np = nextPoints.shift()
      //mark point as walked, if not yet done so
      if (grid3d[np.x][np.y][np.z] === '_') {
        continue
      } else {
        grid3d[np.x][np.y][np.z] = '_'
      }
      //count faces
      totalFaces += countFaces(np)
      //gen next points, neighbours
      nextPoints.push(...genNeighbours(np))
    }
    if (timeout < 0) {
      console.log('timeout!')
    }

    const result = totalFaces
    // 2498
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var genNeighbours = function(p) {
  var neighbours = []
  if (p.x < grid3d.length-1 &&
      grid3d[p.x+1][p.y][p.z] === '.') {
    neighbours.push({x:p.x+1,y:p.y,z:p.z})
  }
  if (p.x > 0 &&
      grid3d[p.x-1][p.y][p.z] === '.') {
    neighbours.push({x:p.x-1,y:p.y,z:p.z})
  }
  if (p.y < grid3d[p.x].length-1 &&
      grid3d[p.x][p.y+1][p.z] === '.') {
    neighbours.push({x:p.x,y:p.y+1,z:p.z})
  }
  if (p.y > 0 &&
      grid3d[p.x][p.y-1][p.z] === '.') {
    neighbours.push({x:p.x,y:p.y-1,z:p.z})
  }
  if (p.z < grid3d[p.x][p.y].length-1 &&
      grid3d[p.x][p.y][p.z+1] === '.') {
    neighbours.push({x:p.x,y:p.y,z:p.z+1})
  }
  if (p.z > 0 &&
      grid3d[p.x][p.y][p.z-1] === '.') {
    neighbours.push({x:p.x,y:p.y,z:p.z-1})
  }

  return neighbours
}

var countFaces = function(p) {
  var faces = 0
  if (p.x < grid3d.length-1 &&
      grid3d[p.x+1][p.y][p.z] === '#') {
    faces++
  }
  if (p.x > 0 &&
      grid3d[p.x-1][p.y][p.z] === '#') {
    faces++
  }
  if (p.y < grid3d[p.x].length-1 &&
      grid3d[p.x][p.y+1][p.z] === '#') {
    faces++
  }
  if (p.y > 0 &&
      grid3d[p.x][p.y-1][p.z] === '#') {
    faces++
  }
  if (p.z < grid3d[p.x][p.y].length-1 &&
      grid3d[p.x][p.y][p.z+1] === '#') {
    faces++
  }
  if (p.z > 0 &&
      grid3d[p.x][p.y][p.z-1] === '#') {
    faces++
  }
  return faces
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
