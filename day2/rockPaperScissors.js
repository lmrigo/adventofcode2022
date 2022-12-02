var input = [
`A Y
B X
C Z`
 ,puzzleInput
]

// A X 1 Rock
// B Y 2 Paper
// C Z 3 Scissors
// Win 6 Draw 3 Lose 0


var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var roundStrings = input[i].split(/\n+/)
    var rounds = []
    $.each(roundStrings, (idx,val) => {
      var plays = val.split(/\s+/)
      var score = 0
      var opScore = 0
      if (plays[0]==="A") {
        if (plays[1]==="X"){
          score = 3 + 1 // draw + rock
          opScore = 3 + 1 // draw + rock
        } else if (plays[1]==="Y"){
          score = 6 + 2 // win + paper
          opScore = 0 + 1 // lose + rock
        } else if (plays[1]==="Z"){
          score = 0 + 3 // lose + scissors
          opScore = 6 + 1 // win + rock
        }
      } else if (plays[0]==="B") {
        if (plays[1]==="X"){
          score = 0 + 1 // lose + rock
          opScore = 6 + 2 // win + paper
        } else if (plays[1]==="Y"){
          score = 3 + 2 // draw + paper
          opScore = 3 + 2 // draw + paper
        } else if (plays[1]==="Z"){
          score = 6 + 3 // win + scissors
          opScore = 0 + 2 // lose + paper
        }
      } else if (plays[0]==="C") {
        if (plays[1]==="X"){
          score = 6 + 1 // win + rock
          opScore = 0 + 3 // lose + scissors
        } else if (plays[1]==="Y"){
          score = 0 + 2 // lose + paper
          opScore = 6 + 3 // win + scissors
        } else if (plays[1]==="Z"){
          score = 3 + 3 // draw + scissors
          opScore = 3 + 3 // draw + scissors
        }
      } else {
        console.log('error!')
      }
      rounds.push([score,opScore])
    })
    
    var result = rounds.reduce((acc,val) => {
      return acc + val[0]
    },0)
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {
  // X needs to lose
  // Y needs to draw
  // Z needs to win

  for (var i = 0; i < input.length; i++) {
    var roundStrings = input[i].split(/\n+/)
    var rounds = []
    $.each(roundStrings, (idx,val) => {
      var plays = val.split(/\s+/)
      var score = 0
      var opScore = 0
      if (plays[0]==="A") {
        if (plays[1]==="X"){
          score = 0 + 3 // lose + scissors
          opScore = 6 + 1 // win + rock
        } else if (plays[1]==="Y"){
          score = 3 + 1 // draw + rock
          opScore = 3 + 1 // draw + rock
        } else if (plays[1]==="Z"){
          score = 6 + 2 // win + paper
          opScore = 0 + 1 // lose + rock
        }
      } else if (plays[0]==="B") {
        if (plays[1]==="X"){
          score = 0 + 1 // lose + rock
          opScore = 6 + 2 // win + paper
        } else if (plays[1]==="Y"){
          score = 3 + 2 // draw + paper
          opScore = 3 + 2 // draw + paper
        } else if (plays[1]==="Z"){
          score = 6 + 3 // win + scissors
          opScore = 0 + 2 // lose + paper
        }
      } else if (plays[0]==="C") {
        if (plays[1]==="X"){
          score = 0 + 2 // lose + paper
          opScore = 6 + 3 // win + scissors
        } else if (plays[1]==="Y"){
          score = 3 + 3 // draw + scissors
          opScore = 3 + 3 // draw + scissors
        } else if (plays[1]==="Z"){
          score = 6 + 1 // win + rock
          opScore = 0 + 3 // lose + scissors
        }
      } else {
        console.log('error!')
      }
      rounds.push([score,opScore])
    })
    
    var result = rounds.reduce((acc,val) => {
      return acc + val[0]
    },0)
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
