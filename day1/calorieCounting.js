var input = [
`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s/)
    var elves = []
    var elvesCount = 0
    $.each(numberStrings, (idx, el) => {
      if (el.length <= 0) {
        elvesCount++
      } else {
        if (!elves[elvesCount]) { // create elf
          elves[elvesCount] = {
            calories: [],
            total: 0
          }
        }
        var cals = Number(el)
        elves[elvesCount].calories.push(cals)
        elves[elvesCount].total += cals
      }
    })

    var result = elves.reduce((acc,val)=>{
      return acc > val.total ? acc : val.total
    },0)

    // 69281
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s/)
    var elves = []
    var elvesCount = 0
    $.each(numberStrings, (idx, el) => {
      if (el.length <= 0) {
        elvesCount++
      } else {
        if (!elves[elvesCount]) { // create elf
          elves[elvesCount] = {
            calories: [],
            total: 0
          }
        }
        var cals = Number(el)
        elves[elvesCount].calories.push(cals)
        elves[elvesCount].total += cals
      }
    })

    elves.sort((a,b) => { //sort by total desc
      return b.total - a.total
    })

    var result = elves[0].total + elves[1].total + elves[2].total
    // 201524
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
