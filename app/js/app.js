class Lindenmayer {
  constructor(axiom, rules) {
    this.axiom = axiom
    this.rules = rules
    this.adn = axiom
  }

  generateNextGenerationAdn() {
    let arr = this.adn.split('')
    arr = arr.map((a) => {
      for (let j = 0; j < this.rules.length; j++) {
        if (a === this.rules[j][0]) {
          return this.rules[j][1]
        }
      }
      return a
    })
    this.adn = arr.join('')
  }
}


function constructPath(string) {
  const point = { x: 0, y: 0 }
  const points = []
  let currentAngle = 0

  points.push({ x: point.x, y: point.y })
  string.split('').map((a) => {
    switch (a) {
      case '+':
        currentAngle += angle
        break
      case '-':
        currentAngle -= angle
        break
      default:
        point.x += stepLength * Math.cos(currentAngle * Math.PI / 180)
        point.y += stepLength * Math.sin(currentAngle * Math.PI / 180)
        points.push({ x: point.x, y: point.y })
        break
    }

    return a
  })

  return points
}

function draw(path) {
  const d = document.querySelector('#draw')
  d.innerHTML = ''
  var lineFunction = d3.svg.line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).interpolate("linear");
  var svgContainer = d3.select("#draw").append("svg")
  var lineGraph = svgContainer.append("path").attr("d", lineFunction(path)).attr("stroke", "black").attr("stroke-width", 0.5).attr("fill", "none").attr("stroke-linejoin", "round");

  let svg = document.getElementsByTagName('svg')[0]
  let box = svg.getBBox()
  console.log(box)
  svg.firstChild.setAttribute('transform', `translate(${-box.x}, ${-box.y})`)
  svgContainer.attr('width', box.width).attr('height', box.height)
}


let axiom = 'A'
let rules = [
  ['A', 'A-B--B+A++AA+B-'],
  ['B', '+A-BB--B-A++A+B'],
]
let angle = 60
let stepLength = 5

let generation = 4

function lsystem() {
  const l = new Lindenmayer(axiom, rules)

  for (let i = 0; i < generation; i++) {
    l.generateNextGenerationAdn()
  }
  draw(constructPath(l.adn))
}

const inputGeneration = document.querySelector('input#generation')
inputGeneration.setAttribute('value', generation)
const inputGenerationStream = Rx.Observable.fromEvent(inputGeneration, 'input')
inputGenerationStream.subscribe(() => {
  generation = inputGeneration.value
  lsystem()
})

const inputAxiom = document.querySelector('input#axiom')
inputAxiom.setAttribute('value', axiom)
const inputAxiomStream = Rx.Observable.fromEvent(inputAxiom, 'input')
inputAxiomStream.subscribe(() => {
  axiom = inputAxiom.value
  lsystem()
})

const inputAngle = document.querySelector('input#angle')
inputAngle.setAttribute('value', angle)
const inputAngleStream = Rx.Observable.fromEvent(inputAngle, 'input')
inputAngleStream.subscribe(() => {
  angle = parseInt(inputAngle.value)
  lsystem()
})

const inputStep = document.querySelector('input#step')
inputStep.setAttribute('value', stepLength)
const inputStepStream = Rx.Observable.fromEvent(inputStep, 'input')
inputStepStream.subscribe(() => {
  stepLength = parseInt(inputStep.value)
  lsystem()
})

const inputRules = document.querySelector('textarea#rules')
inputRules.value = rules
const inputRulesStream = Rx.Observable.fromEvent(inputRules, 'input')
inputRulesStream.subscribe(() => {
  rules = []
  const t = inputRules.value.split(',')
  while (t[0]) {
    rules.push(t.splice(0, 2))
  }
  lsystem()
})

lsystem()
