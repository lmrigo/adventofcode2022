var input = [
`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`
 ,puzzleInput
]

const maxMinutes = 24

var part1 = function() {

  for (var i = 0; i < input.length-1; i++) {
    var blueprintStrings = input[i].split(/\n+/)
    var blueprints = []
    $.each(blueprintStrings,(idx,val)=>{
      const splitted = val.split(/\:?\s+/)
      //Blueprint 1:
      //0         1
      // Each ore robot costs 4 ore.
      // 2    3   4     5     6 7
      // Each clay robot costs 2 ore.
      // 8    9    10    11    12 13
      // Each obsidian robot costs 3 ore and 14 clay.
      // 14   15       16    17    18 19 20  21 22
      // Each geode robot costs 2 ore and 7 obsidian.
      // 23   24    25    26    27 28 29  30 31
      const blueprintNum = Number(splitted[1])
      const oreRobotOreCost = Number(splitted[6])
      const clayRobotOreCost = Number(splitted[12])
      const obsidianRobotOreCost = Number(splitted[18])
      const obsidianRobotClayCost = Number(splitted[21])
      const geodeRobotOreCost = Number(splitted[27])
      const geodeRobotObsiCost = Number(splitted[30])
      var oreCostArr = [oreRobotOreCost,clayRobotOreCost,obsidianRobotOreCost,geodeRobotOreCost]
      oreCostArr.sort()
      const maxOreCost = oreCostArr[3]
      blueprints.push({
        id: blueprintNum,
        oreROreC: oreRobotOreCost,
        clayROreC: clayRobotOreCost,
        obsiROreC: obsidianRobotOreCost,
        obsiRClayC: obsidianRobotClayCost,
        geodROreC:geodeRobotOreCost,
        geodRObsiC:geodeRobotObsiCost,
        maxOreC:maxOreCost
      })
    })
    // console.log(blueprints)

    var qualityLevel = []
    $.each(blueprints,(idx,bp)=>{
      var geodes = simulate(bp)
      qualityLevel.push(bp.id*geodes)
    })
    console.log(qualityLevel)

    const result = qualityLevel.reduce((acc,val) => acc+val)
    // 2159 too low
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var simulate = function(bp) {

  var initialState = {
    robots: {
      ore:1,
      clay:0,
      obsidian:0,
      geode:0
    },
    resources: {
      ore:0,
      clay:0,
      obsidian:0,
      geode:0
    },
    minutes: 0
  }
  var nextStates = [initialState]
  var history = {}
  const initKey = genKey(initialState)
  history.initKey = true
  var maxGeode = 0
  var timeout = 100000
  while (timeout-- > 0 && nextStates.length > 0) {
    var st = nextStates.shift()
    if (st.resources.geode > maxGeode) {
      maxGeode = st.resources.geode
      console.log(st)
    }

    // var generated = genStates(st,bp,history)
    var generated = genStatesGreedy(st,bp,history)
    // first generate next states: return the generated robot list
    $.each(generated,(idx,gen) => {
      // then collect ores from st
      collectResourcesForNextState(st,gen)
      // then add new states to list
      const key = genKey(gen)
      if (!history[key]) {
        nextStates.push(gen)
        history[key] = true
      }
    })

  }
  if (timeout < 0) {
    console.log('timeout!')
  }

  return maxGeode
}

var cloneState = function(st) {
  var newState = {
    robots: {},
    resources: {},
    minutes:st.minutes
  }
  Object.assign(newState.robots,st.robots)
  Object.assign(newState.resources,st.resources)
  return newState
}

var collectResourcesForNextState = function(st,st2) {
  for (var o = 0; o < st.robots.ore; o++) {
    st2.resources.ore++
  }
  for (var c = 0; c < st.robots.clay; c++) {
    st2.resources.clay++
  }
  for (var o = 0; o < st.robots.obsidian; o++) {
    st2.resources.obsidian++
  }
  for (var g = 0; g < st.robots.geode; g++) {
    st2.resources.geode++
  }
}

var genStatesGreedy = function(st,bp,history) {
  var newStates = []
  st.minutes++
  if (st.minutes > maxMinutes) {
    return newStates
  }
  var newSt
  if (st.resources.ore >= bp.geodROreC
      && st.resources.obsidian >= bp.geodRObsiC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.geodROreC
    newSt.resources.obsidian -= bp.geodRObsiC
    newSt.robots.geode++
    newStates.push(newSt)
  } else if (st.resources.ore >= bp.obsiROreC
      && st.resources.clay >= bp.obsiRClayC
      && st.resources.obsidian < bp.geodRObsiC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.obsiROreC
    newSt.resources.clay -= bp.obsiRClayC
    newSt.robots.obsidian++
    newStates.push(newSt)
  } else if (st.resources.ore >= bp.clayROreC
      && st.resources.clay < bp.obsiRClayC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.clayROreC
    newSt.robots.clay++
    newStates.push(newSt)
  } else if (st.resources.ore >= bp.oreROreC
      && st.resources.ore < bp.maxOreC+1) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.oreROreC
    newSt.robots.ore++
    newStates.push(newSt)
  } else {
    newSt = cloneState(st)
    // don't build robot if saving ore
    newStates.push(newSt)
  }

  //build


  return newStates
}

var genStates = function(st,bp,history) {
  var newStates = []
  st.minutes++
  if (st.minutes > maxMinutes) {
    return newStates
  }
  var newSt

  if (st.resources.ore < bp.maxOreC) {
    newSt = cloneState(st)
    // don't build robot if saving ore
    newStates.push(newSt)
  }

  //build
  if (st.resources.ore >= bp.oreROreC
      && st.resources.ore <= bp.maxOreC+1) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.oreROreC
    newSt.robots.ore++
    newStates.push(newSt)
  }
  if (st.resources.ore >= bp.clayROreC
      && st.resources.clay < bp.obsiRClayC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.clayROreC
    newSt.robots.clay++
    newStates.push(newSt)
  }
  if (st.resources.ore >= bp.obsiROreC
      && st.resources.clay >= bp.obsiRClayC
      && st.resources.obsidian < bp.geodRObsiC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.obsiROreC
    newSt.resources.clay -= bp.obsiRClayC
    newSt.robots.obsidian++
    newStates.push(newSt)
  }
  if (st.resources.ore >= bp.geodROreC
      && st.resources.obsidian >= bp.geodRObsiC) {
    newSt = cloneState(st)
    newSt.resources.ore -= bp.geodROreC
    newSt.resources.obsidian -= bp.geodRObsiC
    newSt.robots.geode++
    newStates.push(newSt)
  }
  return newStates
}

var genKey = function (st) {
  return st.minutes + ':'
    + st.robots.ore + ','
    + st.robots.clay + ','
    + st.robots.obsidian + ','
    + st.robots.geode + ':'
    + st.resources.ore + ','
    + st.resources.clay + ','
    + st.resources.obsidian + ','
    + st.resources.geode
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numberStrings = input[i].split(/\s+/)
    var numbers = $.map(numberStrings, (val => {return Number(val)}))

    const result = 0
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
