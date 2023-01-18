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

var checkedPaths

var part2 = function () {

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

    var closedSrc = {}
    // remove empty nodes
    $.each(Object.keys(valves),(idxv,v) => {
      if (valves[v].flow === 0) {
        delete valves[v]
      } else {
        closedSrc[v] = true
      }
    })
    // console.log(valves)

    //TODO: this algorithm works for the example but not for the puzzle input
    // it may work, but it takes too long to check all combinations
    checkedPaths = {}
    var timeout = 3*1*1000
    const maxMinutes = 26 // part 2 specific
    var maxPressure = -1
    var maxPressureMe = -1
    var maxPressureElephant = -1
    var initialState = {
      me:{
        v:'AA',
        path:'AA-',
        mins:maxMinutes,
        pressure:0
      },
      elephant: {
        v:'AA',
        path:'AA-',
        mins:maxMinutes,
        pressure:0
      },
      pressure:0,
      opened:{},
      closed:{}
    }
    Object.assign(initialState.closed,closedSrc)

    var nextStates = [initialState]
    while (timeout-- > 0 && nextStates.length > 0) {
      nextStates.sort((a,b) => {
        return b.pressure-a.pressure
      })

      var st = nextStates.shift()

      if (checkedPaths[st.me.path+'|'+st.elephant.path] !== undefined) {
        continue
      } else {
        checkedPaths[st.me.path+'|'+st.elephant.path] = st.pressure
        checkedPaths[st.elephant.path+'|'+st.me.path] = st.pressure
      }

      //me:  AA-II-JJ-Jo-II-AA-BB-Bo-CC-Co-
      //     AA-Jo-Bo-Co
      //     AA-JJ-BB-CC-
      //ele: AA-DD-Do-EE-FF-GG-HH-Ho-GG-FF-EE-Eo- all opened
      //     AA-Do-Ho-Eo
      //     AA-DD-HH-EE-

      // console.log(st.pressure,st.me.path,st.elephant.path)
      if (maxPressure <= st.pressure) {
        maxPressure = st.pressure
        // console.log(maxPressure,st)
        if (Object.keys(st.opened).length === valvesToOpen) {
          // console.log('all opened')
        }
      }

      if (st.me.mins > 0 || st.elephant.mins > 0) {
        nextStates.push(...genNextStates2(st))
      }
    }
    if (timeout < 0) {
      console.log('timeout!')
      console.log(nextStates.length,nextStates[0])
    }

    //TODO: this algorithm works well enough
    // but still I'm pruning arbitrarily some nodes.
    // only using 6/15 for me and 6/9 for elephant
    var tree = {
      level:0,
      valve:'AA',
      path:'AA-',
      pressure:0,
      next:[]
    }
    var nextNodes = [tree]
    var node = tree
    if (i===0) {
      node.level = 7
    }
    var nodesToTest = []
    while (node.level <= 5) {
      node = nextNodes.shift()
      generateNextNodes(node)
      if (node.level <= 5) {
        // nextNodes.push(...node.next)
        nextNodes.push(node.next[0])
        nextNodes.push(node.next[1])
        nextNodes.push(node.next[2])
        nextNodes.push(node.next[3])
        nextNodes.push(node.next[4])
        nextNodes.push(node.next[5])
        nextNodes.push(node.next[6])
      }
      if (node.level === 5) {
        // nodesToTest.push(...node.next)
        nodesToTest.push(node.next[0])
        nodesToTest.push(node.next[1])
        nodesToTest.push(node.next[2])
        nodesToTest.push(node.next[3])
        nodesToTest.push(node.next[4])
        nodesToTest.push(node.next[5])
        nodesToTest.push(node.next[6])
      }
    }
    // console.log(tree)
    var maxComboPressure = -1

    nodesToTest.sort((a,b)=>{
      return b.pressure-a.pressure
    })
    var timeout = 50
    while(timeout-- > 0 && nodesToTest.length > 0) {
      node = nodesToTest.shift()

      var elephantTree = {
        level:0,
        valve:'AA',
        path:'AA-',
        pressure:0,
        next:[]
      }
      var nextElephantNodes = [elephantTree]
      var elephantNode = elephantTree
      while (elephantNode.level <= 5) {
        elephantNode = nextElephantNodes.shift()
        generateNextElephantNodes(elephantNode,node.path)
        const comboP = node.pressure + elephantNode.next[0].pressure
        if (maxComboPressure < comboP) {
          maxComboPressure = comboP
          // console.log('combop:',comboP)
          // console.log('me:',node.pressure,node.path,' elephant:',elephantNode.next[0].pressure,elephantNode.next[0].path)
        }
        if (elephantNode.level <= 5) {
          nextElephantNodes.push(...elephantNode.next)
        }
      }
    }
    if (timeout < 0) {
      console.log('timeout2!')
      console.log(nodesToTest.length,nodesToTest[0])
    }

    const result = i===0 ? maxPressure : maxComboPressure
    // 2788 too low
    // 2811 correct
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var generateNextNodes = function(node) {
  $.each(valves,(idx,valve) => {
    if (node.path.includes(valve.name)) {
      return true
    }
    const nextPath = node.path+valve.name+'-'
    node.next.push({
      level:node.level+1,
      valve:valve.name,
      path:nextPath,
      pressure:calculatePressure(nextPath),
      next:[]
    })
  })
  node.next.sort((a,b)=>{
    return b.pressure-a.pressure
  })
}

var generateNextElephantNodes = function(node,otherPath) {
  $.each(valves,(idx,valve) => {
    if (node.path.includes(valve.name)
      || otherPath.includes(valve.name)) {
      return true
    }
    const nextPath = node.path+valve.name+'-'
    node.next.push({
      level:node.level+1,
      valve:valve.name,
      path:nextPath,
      pressure:calculatePressure(nextPath),
      next:[]
    })
  })
  node.next.sort((a,b)=>{
    return b.pressure-a.pressure
  })
}

// before deciding the next state,
// calculate all destinations
// generate all path permutations and only then choose the best
var genNextStates2 = function (st) {
  var newStates = []
  if (Object.keys(st.opened).length===valvesToOpen) {
    st.me.mins = 0
    st.elephant.mins = 0
    newStates.push(st)
    return newStates
  }
  var pressureCostListMe = []
  var pressureCostListElephant = []
  $.each(Object.keys(st.closed),(idx,vName) => {
    // calculate pressure released as: pressure * remaining minutes
    // remaining minutes = current minutes - time wasted traveling

    //skip
    if (!st.closed[vName]) {
      return true
    }

    // me

    // cost = minutes to travel + 1 minute to open
    const costMe = valvesDistance[st.me.v+'-'+vName] + 1
    // profit (pressure released * cost)
    const profitMe = valves[vName].flow * (st.me.mins - costMe)
    if (profitMe > 0) {
      pressureCostListMe.push({
        owner:'M',
        name:vName,
        cost:costMe,
        profit:profitMe
      })
    }

    // elephant

    // cost = remaining minutes + 1 minute to open
    const costElephant = valvesDistance[st.elephant.v+'-'+vName] + 1
    // profit (pressure released * cost)
    const profitElephant = valves[vName].flow * (st.elephant.mins - costElephant)
    if (profitElephant > 0) {
      pressureCostListElephant.push({
        owner:'E',
        name:vName,
        cost:costElephant,
        profit:profitElephant
      })
    }
  })
  // pressureCostListMe.sort((a,b)=>{
  //   return b.profit-a.profit
  // })
  // pressureCostListElephant.sort((a,b)=>{
  //   return b.profit-a.profit
  // })

  // combine lists
  var pressureCostListCombined = []
  for (var a = 0; a < pressureCostListMe.length; a++) {
    for (var b = 0; b < pressureCostListElephant.length; b++) {
      if (pressureCostListMe[a].name === pressureCostListElephant[b].name) { //skip
        continue
      }
      pressureCostListCombined.push({
        me: pressureCostListMe[a],
        elephant: pressureCostListElephant[b],
        profit: pressureCostListMe[a].profit + pressureCostListElephant[b].profit
      })
    }
  }
  // pressureCostListCombined.sort((a,b)=>{
  //   return b.profit-a.profit
  // })


  $.each(pressureCostListCombined,(idx2,next)=> {
    const newNameMe = next.me.name
    const newNameElephant = next.elephant.name
    const newMinsMe = st.me.mins-next.me.cost
    const newMinsElephant = st.elephant.mins-next.elephant.cost
    const newPressure = st.pressure + next.profit
    const newPressureMe = st.me.pressure + next.me.profit
    const newPressureElephant = st.elephant.pressure + next.elephant.profit
    const newState = {
      me: {
        v:newNameMe,
        path:st.me.path+newNameMe+'-',
        mins:newMinsMe,
        pressure:newPressureMe
      },
      elephant: {
        v:newNameElephant,
        path:st.elephant.path+newNameElephant+'-',
        mins:newMinsElephant,
        pressure:newPressureElephant
      },
      pressure:newPressure,
      opened:{},
      closed:{}
    }
    if (checkedPaths[newState.me.path+'|'+newState.elephant.path] === undefined) {
      Object.assign(newState.opened,st.opened)
      Object.assign(newState.closed,st.closed)
      newState.opened[newNameMe] = true
      newState.closed[newNameMe] = false
      newState.opened[newNameElephant] = true
      newState.closed[newNameElephant] = false
      newStates.push(newState)
    }
  })

  return newStates
}

var calculatePressure = function(path) {
  var pressure = 0
  var steps = path.split('-')
  if (path.endsWith('-')) {
    steps.splice(steps.length-1,1)
  }

  var mins = 26
  for (var s = 0; s < steps.length-1; s++) {
    var from = steps[s]
    var to = steps[s+1]
    const cost = valvesDistance[from+'-'+to] + 1
    mins -= cost
    const profit = valves[to].flow * mins
    pressure += profit
  }
  return pressure
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})

      /*
CORRECT:
combop: 2811
me: 1686 AA-JI-ZD-PL-HN-IY-LE-
elephant: 1125 AA-ZM-QY-YL-ZQ-QR-XD-

WRONG:
{
    "me": {
        "v": "PE",
        "path": "AA-JI-ZD-PL-HN-ZM-PE-",
        "mins": 3
    },
    "elephant": {
        "v": "QR",
        "path": "AA-IY-LE-QY-YL-ZQ-QR-",
        "mins": 2
    },
    "pressure": 2788,
    "opened": {
        "JI": true,
        "IY": true,
        "ZD": true,
        "LE": true,
        "PL": true,
        "QY": true,
        "HN": true,
        "YL": true,
        "ZM": true,
        "ZQ": true,
        "PE": true,
        "QR": true
    }
}
      */
