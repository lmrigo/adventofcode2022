var input = [
'mjqjpqmgbljsphdztnvjfqwrcgsmlb',
'bvwbjplbgvbhsrlpgdmjqwftvncz',
'nppdvjthqldpwncqszvftbrmjlhg',
'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var stream = input[i]
    var marker = ''
    var markerPos = -1
    for (var j = 0; j < stream.length; j++) {
      var nextChar = stream.charAt(j)
      var idxNextChar = marker.lastIndexOf(nextChar)
      if (idxNextChar >= 0) {
        marker = marker.substr(idxNextChar+1,marker.length) + nextChar
      } else {
        if (marker.length < 3) {
          marker += nextChar
          continue
        }
        markerPos = j+1
        break
      }
    }

    var result = markerPos
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var stream = input[i]
    var marker = ''
    var markerPos = -1
    for (var j = 0; j < stream.length; j++) {
      var nextChar = stream.charAt(j)
      var idxNextChar = marker.lastIndexOf(nextChar)
      if (idxNextChar >= 0) {
        marker = marker.substr(idxNextChar+1,marker.length) + nextChar
      } else {
        if (marker.length < 13) {
          marker += nextChar
          continue
        }
        markerPos = j+1
        break
      }
    }

    var result = markerPos
    // console.log(result)
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
