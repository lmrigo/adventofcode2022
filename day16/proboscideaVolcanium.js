var input = [
`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`
 ,puzzleInput
]

var valves
var valvesToOpen
var valvesDistance

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var inputStrings = input[i].split(/\n+/)
    valves = {}
    valvesToOpen = 0
    valvesDistance = {}
    $.each(inputStrings,(idx,is)=>{
      var splitted = is.split(/\,?\;?\s+/)
      const valveName = splitted[1]
      const flowRate = Number(splitted[4].split('=')[1])
      if (flowRate > 0) {
        valvesToOpen++
      }
      var links = []
      for (var l = 9; l < splitted.length; l++) {
        links.push(splitted[l])
      }
      valves[valveName] = {
        name:valveName,
        flow:flowRate,
        links:links
      }
    })
    // console.log(valves)

    fillValvesDistance()
    // console.log(valvesDistance)

    var timeout = 1000000
    const maxMinutes = 30
    var maxPressure = -1
    var initialState = {
      v:'AA',
      mins:maxMinutes,
      pressure:0,
      opened:{},
      path:'AA-'
    }
    var nextStates = [initialState]
    while (timeout-- > 0 && nextStates.length > 0) {
      var st = nextStates.shift()
      //AA-DD-CC-BB-AA-II-JJ-II-AA-DD-EE-FF-GG-HH-GG-FF-EE-DD-CC
      //AA-DD-BB-JJ-HH-EE-CC
      // console.log(st.pressure,st.path)
      if (maxPressure < st.pressure) {
        maxPressure = st.pressure
      }
      if (st.mins > 0) {
        nextStates.push(...genNextStates(st))
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
      console.log(nextStates[0])
    }

    const result = maxPressure
    // 2265
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var fillValvesDistance = function() {
  $.each(Object.keys(valves),(idx,vSrc) => {
    const valveSrc = valves[vSrc]
    $.each(Object.keys(valves),(idx2,vDst) => {
      if (vSrc === vDst) { // same node
        valvesDistance[vSrc+'-'+vDst] = 0
      } else if (valvesDistance[vDst+'-'+vSrc] !== undefined) {
        // already filled, but on the other way
        valvesDistance[vSrc+'-'+vDst] = valvesDistance[vDst+'-'+vSrc]
      } else {
        var minDistance = 9999
        var nextNodes = $.map(valveSrc.links,(x) => {
          return {
            steps: 1,
            destName: x
          }
        })
        var visited = []
        visited.push({
          steps: 0,
          destName:vSrc
        })
        while (nextNodes.length > 0) {
          var currNode = nextNodes.shift()
          if (currNode.destName === vDst) {
            if (currNode.steps < minDistance) {
              minDistance = currNode.steps
            }
          } else {
            visited.push(currNode)
            $.each(valves[currNode.destName].links,(idx2,link)=>{
              // if not visited or if visited but with more steps
              const vIdx = visited.findIndex(x => x.destName === link)
              const vSteps = vIdx < 0 ? false : visited[vIdx].steps > (currNode.steps + 1)
              if (vIdx < 0 || vSteps) {
                nextNodes.push({
                  steps: (currNode.steps+1),
                  destName: link
                })
              }
            })
          }
        }
        valvesDistance[vSrc+'-'+vDst] = minDistance
      }
    })
  })
}

// before deciding the next state,
// calculate all destinations
// generate all path permutations and only then choose the best
var genNextStates = function (st) {
  var newStates = []
  if (Object.keys(st.opened).length===valvesToOpen) {
    st.mins = 0
    newStates.push(st)
    return newStates
  }
  var pressureCostList = []
  $.each(Object.keys(valves),(idx,vName) => {
    // calculate pressure released as: pressure * remaining minutes
    // remaining minutes = current minutes - time wasted traveling

    //skip
    if (vName === st.v // same node
        || st.opened[vName]) { // already opened
      return true
    }

    // cost = remaining minutes + 1 minute to open
    const cost = valvesDistance[st.v+'-'+vName] + 1
    // profit (pressure released * cost)
    const profit = valves[vName].flow * (st.mins - cost)

    pressureCostList.push({
      name:vName,
      cost:cost,
      profit:profit
    })
  })
  pressureCostList.sort((a,b)=>{
    return b.profit-a.profit
  })
  $.each(pressureCostList,(idx2,next)=> {
    if (next.profit > 0) {
      const newName = next.name
      const newMins = st.mins-next.cost
      const newPressure = st.pressure + next.profit
      const newState = {
        v:newName,
        mins:newMins,
        pressure:newPressure,
        opened:{},
        path:st.path+newName+'-'
      }
      Object.assign(newState.opened,st.opened)
      newState.opened[newName] = true
      newStates.push(newState)
    }
  })

  return newStates
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
