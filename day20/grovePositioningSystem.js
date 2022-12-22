var input = [
`1
2
-3
3
-2
0
4`
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var numbers = $.map(numberStrings, (val => {return Number(val)}))

    var refArray = []
    var firstNum = {
      val: numbers[0],
      prev:null,
      next:null
    }
    refArray[0] = firstNum
    var prevNum = firstNum
    for (var n = 1; n < numbers.length; n++) {
      var num = {
        val: numbers[n],
        prev: prevNum,
        next: null
      }
      refArray[n] = num
      prevNum.next = num
      //prepare for next
      prevNum = num
    }
    // close the circle
    var lastNum = refArray[numbers.length-1]
    lastNum.next = firstNum
    firstNum.prev = lastNum

    // console.log(refArray)

    for (var n = 0; n < refArray.length; n++) {
      var numA = refArray[n]
      var counter = numA.val
      // console.log(numA.prev.val+'<'+numA.val+'>'+numA.next.val)
      if (counter > 0) {
        while (counter-- > 0) {
          //   A - B
          //ap B   A bn
          var numB = numA.next

          numA.prev.next = numB
          numB.next.prev = numA

          //   A - B
          //ap bn  A bn
          numA.next = numB.next
          //   A - B
          //ap bn  A A
          numB.next = numA
          //   A - B
          //ap bn  ap A
          numB.prev = numA.prev
          //  A - B
          //B bn  ap A
          numA.prev = numB
          //   B - A
          //ap A   B bn
        }
      } else if (counter < 0) {
        while (counter++ < 0) {
          //   B - A
          //bp A   B an
          var numB = numA.prev

          numA.next.prev = numB
          numB.prev.next = numA

          //   B - A
          //bp A   bp an
          numA.prev = numB.prev
          //   B - A
          //A  A   bp an
          numB.prev = numA
          //   B - A
          //A  an  bp an
          numB.next = numA.next
          //   B - A
          //A  an  bp B
          numA.next = numB
          //   A - B
          //bp B   A an
        }
      }
      // console.log(numA.prev.val+'<'+numA.val+'>'+numA.next.val)

    }
    // console.log(refArray)

    //1000th, 2000th, and 3000th numbers after the value 0,
    var node = refArray[0]
    var zeroNode = undefined
    var n = 0
    while (n < refArray.length && zeroNode === undefined) {
      if (node.val === 0) {
        zeroNode = node
      } else {
        n++
        node = node.next
      }
    }

    var marker1 = 1000
    var m1counter = marker1 % refArray.length
    node = zeroNode
    while (m1counter-- > 0) {
      node = node.next
    }
    marker1 = node.val

    var marker2 = 2000
    var m2counter = marker2 % refArray.length
    node = zeroNode
    while (m2counter-- > 0) {
      node = node.next
    }
    marker2 = node.val

    var marker3 = 3000
    var m3counter = marker3 % refArray.length
    node = zeroNode
    while (m3counter-- > 0) {
      node = node.next
    }
    marker3 = node.val

    // console.log(marker1,marker2,marker3)
    const result = marker1 + marker2 + marker3
    // 13183
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var printList = function(first,length) {
  var strp = ''
  var nodep = first
  var np = length
  while (np-- > 0) {
    strp += nodep.val + ', '
    nodep = nodep.next
  }
  console.log(strp)
}

const decriptionKey = 811589153 //part 2 specific

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var numbers = $.map(numberStrings, (val => {return Number(val)}))

    var refArray = []
    var firstNum = {
      val: numbers[0]*decriptionKey,
      prev:null,
      next:null,
      id:'id'+0
    }
    refArray[0] = firstNum
    var prevNum = firstNum
    for (var n = 1; n < numbers.length; n++) {
      var num = {
        val: numbers[n]*decriptionKey,
        prev: prevNum,
        next: null,
        id:'id'+n
      }
      refArray[n] = num
      prevNum.next = num
      //prepare for next
      prevNum = num
    }
    // close the circle
    var lastNum = refArray[numbers.length-1]
    lastNum.next = firstNum
    firstNum.prev = lastNum

    // console.log(refArray)

// This was actually not needed.
// The ref list didn't rebuild after each iteration
//weird2 part2 logic for firstnum
// 1, -3, 2, 3, -2, 0, 4 |-3
// -3, 1, 2, 3, -2, 0, 4 |-2!
// 4, 1, 2, 3, -2, 0, -3 |-1!
// 4, 1, 2, 3, -2, -3, 0 | 0
// 1, 2, 3, -2, -3, 0, 4 | actual

// 1, 2, -2, -3, 0, 3, 4 |-2
// 1, -2, 2, -3, 0, 3, 4 |-1!
// -2, 1, 2, -3, 0, 3, 4 | 0!
// 1, 2, -3, 0, 3, 4, -2 | actual


// 1, 2, -3, 0, 3, 4, -2 | 4
// 1, 2, -3, 0, 3, -2, 4 | 3!
// 4, 2, -3, 0, 3, -2, 1 | 2!
// 2, 4, -3, 0, 3, -2, 1 | 1
// 2, -3, 4, 0, 3, -2, 1 | 0
// 1, 2, -3, 4, 0, 3, -2 | actual
    var printFirst = refArray[0]

    const totalMix = 10 // part 2 specific
    for (var m = 0; m < totalMix; m++) {
      // console.log(refArray)
      // printList(printFirst,refArray.length)

      //mix
      for (var n = 0; n < refArray.length; n++) {
        var numA = refArray[n]
        var counter = numA.val % (refArray.length-1)
        // console.log(numA.prev.val+'<'+numA.val+'>'+numA.next.val)
        if (counter > 0) {
          while (counter-- > 0) {
            //   A - B
            //ap B   A bn
            var numB = numA.next

            // not needed. see comment on line 196
            // if (numB.id === firstNum.id) {
            //   // firstNum = numA //normally should be this
            //   firstNum = numB //weird part 2 logic
            // } else if (numA.id === firstNum.id) {
            //   firstNum = numB
            // }

            numA.prev.next = numB
            numB.next.prev = numA

            //   A - B
            //ap bn  A bn
            numA.next = numB.next
            //   A - B
            //ap bn  A A
            numB.next = numA
            //   A - B
            //ap bn  ap A
            numB.prev = numA.prev
            //  A - B
            //B bn  ap A
            numA.prev = numB
            //   B - A
            //ap A   B bn
          }
        } else if (counter < 0) {
          while (counter++ < 0) {
            //   B - A
            //bp A   B an
            var numB = numA.prev

            // not needed. see comment on line 196
            // if (numB.id === firstNum.id) {
            //   // firstNum = numA //normally should be this
            //   firstNum = numB //weird part 2 logic
            // } else if (numA.id === firstNum.id) {
            //   // firstNum = numB //normally should be this
            //   firstNum = numA.next //weird part 2 logic
            // }

            numA.next.prev = numB
            numB.prev.next = numA

            //   B - A
            //bp A   bp an
            numA.prev = numB.prev
            //   B - A
            //A  A   bp an
            numB.prev = numA
            //   B - A
            //A  an  bp an
            numB.next = numA.next
            //   B - A
            //A  an  bp B
            numA.next = numB
            //   A - B
            //bp B   A an
          }
        } else { // it's 0
          printFirst = numA
        }
        // console.log(numA.prev.val+'<'+numA.val+'>'+numA.next.val)
      }

      // not needed. see comment on line 196
      //rebuild refArray for next iteration
      // refArray = []
      // refArray[0] = firstNum
      // var nodeR = firstNum.next
      // var r = 1
      // while (r < numbers.length) {
      //   refArray[r] = nodeR
      //   nodeR = nodeR.next
      //   r++
      // }
      // console.log(refArray)
    }
    // console.log(refArray)
    // printList(printFirst,refArray.length)


    //1000th, 2000th, and 3000th numbers after the value 0,
    var node = refArray[0]
    var zeroNode = undefined
    var n = 0
    while (n < refArray.length && zeroNode === undefined) {
      if (node.val === 0) {
        zeroNode = node
      } else {
        n++
        node = node.next
      }
    }

    var marker1 = 1000
    var m1counter = marker1 % refArray.length
    node = zeroNode
    while (m1counter-- > 0) {
      node = node.next
    }
    marker1 = node.val

    var marker2 = 2000
    var m2counter = marker2 % refArray.length
    node = zeroNode
    while (m2counter-- > 0) {
      node = node.next
    }
    marker2 = node.val

    var marker3 = 3000
    var m3counter = marker3 % refArray.length
    node = zeroNode
    while (m3counter-- > 0) {
      node = node.next
    }
    marker3 = node.val

    // console.log(marker1,marker2,marker3)
    const result = marker1 + marker2 + marker3
    // 6676132372578
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
