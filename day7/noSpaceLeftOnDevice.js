var input = [
`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`
 ,puzzleInput
]

const dirMaxSize = 100000
var dirsUnderMaxSize

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var commandStrings = input[i].split(/\n+/)

    dirsUnderMaxSize = [] // reset
    var root = newDir('./', null)
    var c = 0
    var pointer = root
    while (c < commandStrings.length) {
      var command = commandStrings[c].split(/\s+/)
      if (command[0] === '$') {
        if (command[1] === 'cd') {
          if (command[2] === '/') { // go to root
            pointer = root
          } else if (command[2] === '..') { // go up directory
            pointer = pointer.parent
          } else { // go into directory
            const dirName = command[2]
            const idxOfDir = pointer.children.findIndex((x) => {
                return x.name === dirName
              })
            if (idxOfDir < 0) { // create if unexisting
              pointer.children.push(newDir(dirName,pointer))
              //TODO: should not happen
              console.log('aconteceu')
            }
            pointer = pointer.children.find((x) => {
              return x.name === dirName
            })
            if (pointer === undefined) { console.err('erro!!!!') }
          }
        } else { // 'ls'
          // nothing to do
        }
      } else { // not a command, filename or dirname
        if (command[0] === 'dir') {
          const dirName = command[1]
          const idxOfDir = pointer.children.findIndex((x) => {
              return x.name === dirName
            })
          if (idxOfDir < 0) { // create if unexisting
            pointer.children.push(newDir(dirName,pointer))
          }
        } else {
          const fileSize = command[0]
          const fileName = command[1]
          pointer.children.push(newFile(fileName,pointer, fileSize))
        }
      }
      c++
    }

    const totalSize = calculateSizePart1(root)

    // console.log(root)

    // find all of the directories with a total size of at most 100000
    var sumOfDirsUnderMaxSize = dirsUnderMaxSize.reduce((acc,val) => {
      return acc + val
    })

    const result = sumOfDirsUnderMaxSize
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var newDir = function(name, parent) {
  return {
      name: name,
      size: 0,
      parent: parent,
      children: []
    }
}

var newFile = function(name, parent, size) {
  return {
      name: name,
      size: Number(size),
      parent: parent,
      children: undefined
    }
}

var calculateSizePart1 = function(node) {
  if (node.children === undefined) {
    return node.size
  }
  var size = 0
  $.each(node.children, (idx,child) => {
    size += calculateSizePart1(child)
  })
  node.size = size
  if (size <= dirMaxSize) {
    dirsUnderMaxSize.push(node.size)
  }
  return size
}

var calculateSize = function(node) {
  if (node.children === undefined) {
    return node.size
  }
  var size = 0
  $.each(node.children, (idx,child) => {
    size += calculateSize(child)
  })
  node.size = size
  return size
}

const totalDiskSpace = 70000000
const diskSpaceNeeded = 30000000

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var commandStrings = input[i].split(/\n+/)

    var root = newDir('./', null)
    var c = 0
    var pointer = root
    while (c < commandStrings.length) {
      var command = commandStrings[c].split(/\s+/)
      if (command[0] === '$') {
        if (command[1] === 'cd') {
          if (command[2] === '/') { // go to root
            pointer = root
          } else if (command[2] === '..') { // go up directory
            pointer = pointer.parent
          } else { // go into directory
            const dirName = command[2]
            const idxOfDir = pointer.children.findIndex((x) => {
                return x.name === dirName
              })
            if (idxOfDir < 0) { // create if unexisting
              pointer.children.push(newDir(dirName,pointer))
              //TODO: should not happen
              console.log('aconteceu')
            }
            pointer = pointer.children.find((x) => {
              return x.name === dirName
            })
            if (pointer === undefined) { console.err('erro!!!!') }
          }
        } else { // 'ls'
          // nothing to do
        }
      } else { // not a command, filename or dirname
        if (command[0] === 'dir') {
          const dirName = command[1]
          const idxOfDir = pointer.children.findIndex((x) => {
              return x.name === dirName
            })
          if (idxOfDir < 0) { // create if unexisting
            pointer.children.push(newDir(dirName,pointer))
          }
        } else {
          const fileSize = command[0]
          const fileName = command[1]
          pointer.children.push(newFile(fileName,pointer, fileSize))
        }
      }
      c++
    }

    const totalSize = calculateSize(root)
    // console.log(root)

    // Find the size of the smallest directory that, if deleted,
    // would free up enough space on the filesystem to run the update
    const availableSpace = totalDiskSpace - root.size
    const targetedDirSize = findTargetedDirSize(root, availableSpace)


    var result = targetedDirSize
    // console.log(result)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }

}

var findTargetedDirSize = function(node, availableSpace) {
  if (node.children === undefined) {
    return 0
  }
  var size = 0
  if (availableSpace + node.size >= diskSpaceNeeded) {
    size = node.size
    $.each(node.children, (idx,child) => {
      var childSize = findTargetedDirSize(child, availableSpace)
      if (childSize > 0) {
        size = size < childSize ? size : childSize
      }
    })
  }

  return size
}


$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
