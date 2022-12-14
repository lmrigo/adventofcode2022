var input = [
`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
`[[9,[8,[7]],4,7,[[4,9,3,2],6,5,[1,10,2,4,5],[1,3,2,6,1]]],[4,[6],3],[4,[7,0,3,8,8],[7,[10],[10,10,10,7]]]]
[[],[[6,4,[5],4,[0,5,5]],3,[5,[],9]],[[[5,1,6,2],[6,4,7],[4,7,4,2]],[10,[],[6,9,4],[6,2],9]],[[[10,5,9],10,0,[4,1,4,10,1],1],[7,7,[10,8],6],2]]`
 ,puzzleInput
]

var parseString = function(inString) {
  var root = {
    val: null,
    children: [],
    parent: undefined,
    ci: 0
  }
  var node = root
  for (var c = 0; c < inString.length; c++) {
    const nextChar = inString.charAt(c)
    if (nextChar === '[') { // new branch
      var newNode = {
        val: null,
        children: [],
        parent: node,
        ci: 0
      }
      node.children.push(newNode)
      node = newNode
    } else if (nextChar === ']') { // close branch
      node = node.parent
    } else if (nextChar === ',') {
      // do nothing?
    } else { // add number
      var numBuffer = nextChar
      while ((inString.charAt(c+1).match(/\d/) || []).length > 0) {
        numBuffer += inString.charAt(++c)
      }
      node.children.push({
        val:Number(numBuffer),
        children:null,
        parent:node
      })
    }
  }
  // console.log(root)
  return root
}

var nodeToString = function (node) {
  var str = ''
  if (node.val !== null) {
    str += ''+node.val
  } else {
    str += '['
    if (node.children.length > 0) {
      $.each(node.children,(idx,child) => {
        str += nodeToString(child) + ','
      })
      str = str.substr(0,str.length-1)
    }
    str += ']'
  }
  return str
}

var isOrderRight = function(rootA, rootB) {
  var ordered = undefined
  var nextA = copyNode(rootA)
  var nextB = copyNode(rootB)
  //ci === child index
  while (nextA !== undefined && nextB !== undefined) {
    if (nextA.val === null && nextB.val === null) { // both lists
      const aHasListItems = nextA.ci < nextA.children.length
      const bHasListItems = nextB.ci < nextB.children.length
      if (!aHasListItems && bHasListItems) {
        ordered = true
        break
      } else if (aHasListItems && !bHasListItems) {
        ordered = false
        break
      } else {
        if (aHasListItems) { // get next A list value
          nextA = nextA.children[nextA.ci]
        } else {
          nextA = nextA.parent
          if (nextA) {
            nextA.ci++
          }
        }
        if (bHasListItems) {  // get next B list value
          nextB = nextB.children[nextB.ci]
        } else {
          nextB = nextB.parent
          if (nextB) {
            nextB.ci++
          }
        }
      }
    } else if (nextA.val !== null && nextB.val === null) { //only B is list
      nextA.children = [{
        val: nextA.val,
        children: null,
        parent: nextA
      }]
      nextA.val = null
      nextA.ci = 0
    } else if (nextA.val === null && nextB.val !== null) { //only A is list
      nextB.children = [{
        val: nextB.val,
        children: null,
        parent: nextB
      }]
      nextB.val = null
      nextB.ci = 0
    } else if (nextA.val !== null && nextB.val !== null) { //both numbers
      // console.log('compare:'+nextA.val+' vs '+nextB.val)
      if (nextA.val > nextB.val) {
        ordered = false
        break
      } else if (nextA.val < nextB.val) {
        ordered = true
        break
      } else {
        nextA.parent.ci++
        nextA = nextA.parent
        nextB.parent.ci++
        nextB = nextB.parent
      }
    }
  }
  if (nextA === undefined && nextB !== undefined) {
    ordered = true
  } else if (nextA !== undefined && nextB === undefined) {
    ordered = false
  }
  return ordered
}

var copyNode = function (node) {
  var copy = {}
  if (node.val !== null) {
    Object.assign(copy,node)
    copy.parent = undefined
  } else {
    copy = {
      val: null,
      children: [],
      parent: undefined,
      ci: 0
    }
    $.each(node.children,(idx,child) => {
      var childCopy = copyNode(child)
      copy.children.push(childCopy)
      childCopy.parent = copy
    })
  }
  return copy
}

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var arrayStrings = input[i].split(/\n+/)
    var pairs = []
    var pairIndex = 0
    var orderedPairs = []
    for (var a = 0; a < arrayStrings.length; a+=2) {
      pairIndex++
      // console.log(arrayStrings[a])
      // console.log(arrayStrings[a+1])
      var rootA = parseString(arrayStrings[a])
      rootA = rootA.children[0]
      var rootB = parseString(arrayStrings[a+1])
      rootB = rootB.children[0]
      // console.log(nodeToString(rootA),nodeToString(rootB))

      if (isOrderRight(rootA,rootB)) {
        orderedPairs.push(pairIndex)
        // console.log(pairIndex)
      }
    }

    // console.log(orderedPairs)
    const result = orderedPairs.reduce((acc,val) => {
      return acc + val
    },0)
    // 6272
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {
  const part2Additional =`
[[2]]
[[6]]`

  for (var i = 0; i < input.length; i++) {
    input[i]+= part2Additional
    var arrayStrings = input[i].split(/\n+/)

    // parse
    var packets = []
    for (var a = 0; a < arrayStrings.length; a++) {
      var root = parseString(arrayStrings[a])
      root = root.children[0]
      if (a === (arrayStrings.length-2)) {
        root.markerStart = true
      } else if (a === (arrayStrings.length-1)) {
        root.markerEnd = true
      }
      packets.push(root)
      // console.log(nodeToString(root))
    }

    // sort
    packets.sort((a,b) => {
      return isOrderRight(a,b) ? -1 : 1
    })
    // console.log(packets)

    var startIdx
    var endIdx
    $.each(packets,(idx,pkt) => {
      // console.log(nodeToString(pkt))
      if (pkt.markerStart) {
        startIdx = idx + 1
      } else if (pkt.markerEnd) {
        endIdx = idx + 1
      }
    })

    const result = startIdx * endIdx
    // 22288
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
