var input = [
`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var pairStrings = input[i].split(/\s+/)
    var pairs = $.map(pairStrings, (val => {
      var pairStringArray = val.split(',')
      var pair1 = $.map(pairStringArray[0].split('-'),num => {
        return Number(num)        
      })
      var pair2 = $.map(pairStringArray[1].split('-'),num => {
        return Number(num)        
      })
      return {'a':pair1,'b':pair2}
    }))
//    console.log(pairs)
    var fullyContained = 0
    $.each(pairs,(idx,pair) => {
      // is b in a?
      if (pair.a[0] <= pair.b[0] && pair.b[1] <= pair.a[1]) {
        fullyContained++
        return
      }
      // is a in b?
      if (pair.b[0] <= pair.a[0] && pair.a[1] <= pair.b[1]) {
        fullyContained++
      }
    })

    var result = fullyContained
    // 602
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var pairStrings = input[i].split(/\s+/)
    var pairs = $.map(pairStrings, (val => {
      var pairStringArray = val.split(',')
      var pair1 = $.map(pairStringArray[0].split('-'),num => {
        return Number(num)        
      })
      var pair2 = $.map(pairStringArray[1].split('-'),num => {
        return Number(num)        
      })
      return {'a':pair1,'b':pair2}
    }))
//    console.log(pairs)
    var overlaps = 0
    $.each(pairs,(idx,pair) => {
      // a-low between b-low and b-high
      if (pair.b[0] <= pair.a[0] && pair.a[0] <= pair.b[1]) {
        overlaps++
        return
      }
      // a-high between b-low and b-high
      if (pair.b[0] <= pair.a[1] && pair.a[1] <= pair.b[1]) {
        overlaps++
        return
      }
      // b-low between a-low and a-high
      if (pair.a[0] <= pair.b[0] && pair.b[0] <= pair.a[1]) {
        overlaps++
        return
      }
      // b-high between a-low and a-high
      if (pair.a[0] <= pair.b[1] && pair.b[1] <= pair.a[1]) {
        overlaps++
      }
    })

    var result = overlaps
    // 891
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
