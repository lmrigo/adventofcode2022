var input = [
`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`
 ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var rucksacks = input[i].split(/\n+/)
    var prioritySum = 0
    $.each(rucksacks, (idx,rs) => {
      var commonItem = ''

      var firstHalf = rs.substr(0,rs.length/2)
      var firstCompartment = {}
      $.each(firstHalf.split(''),(idx2,letter) => {
        firstCompartment[letter] = true
      })
      var secondHalf = rs.substr(rs.length/2,rs.length)
      var secondCompartment = {}
      $.each(secondHalf.split(''),(idx2,letter) => {
        secondCompartment[letter] = true
        if (firstCompartment[letter] && secondCompartment[letter]) {
          commonItem = letter
        }
      })
      prioritySum += priority(commonItem)
    })

    var result = prioritySum
    // console.log(result)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var priority = function(letter) {
  if (letter === letter.toUpperCase()) {
    return letter.charCodeAt(0) - 64 + 26; //ASCII A = 65
  } else {
    return letter.charCodeAt(0) - 96; //ASCII a = 97
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var rucksacks = input[i].split(/\n+/)
    var prioritySum = 0
    for (var j = 0; j < rucksacks.length; j+=3) {
      var rs1 = rucksacks[j]
      var rs2 = rucksacks[j+1]
      var rs3 = rucksacks[j+2]

      var commonItems12 = {}
      var badge = ''

      var firstRucksack = {}
      $.each(rs1.split(''),(idx,letter) => {
        firstRucksack[letter] = true
      })
      var secondRucksack = {}
      $.each(rs2.split(''),(idx,letter) => {
        secondRucksack[letter] = true
        if (firstRucksack[letter] && secondRucksack[letter]) {
          commonItems12[letter] = true
        }
      })
      var thirdRucksack = {}
      $.each(rs3.split(''),(idx,letter) => {
        thirdRucksack[letter] = true
        if (commonItems12[letter] && thirdRucksack[letter]) {
          badge = letter
        }
      })
      // console.log(badge)
      prioritySum += priority(badge)
    }

    var result = prioritySum
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
