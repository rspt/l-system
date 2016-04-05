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

/////////////////////////
/////////////////////////
/////////////////////////

const LSystemText = function() {
  this.generation = 4
  this.axiom = 'A'
  this.rules = 'A,A-B--B+A++AA+B-,B,+A-BB--B-A++A+B'
  this.angle = 60
  this.stepLength = 5
  this.reset = () => {
    generation = 4
    axiom = 'A'
    rules = []
    const t = 'A,A-B--B+A++AA+B-,B,+A-BB--B-A++A+B'.split(',')
    while (t[0]) {
      rules.push(t.splice(0, 2))
    }
    angle = 60
    stepLength = 5
    lsystem()
  }
}

window.onload = () => {
  const text = new LSystemText()
  const gui = new dat.GUI()
  const guiGeneration = gui.add(text, 'generation', 1, 5).step(1)
  const guiAxiom = gui.add(text, 'axiom')
  const guiRules = gui.add(text, 'rules')
  const guiAngle = gui.add(text, 'angle', 0, 180).step(1)
  const guiStepLength = gui.add(text, 'stepLength', 1, 100).step(1)
  const guiReset = gui.add(text, 'reset')

  guiGeneration.onChange((value) => {
    generation = value
    lsystem()
  })

  guiAxiom.onChange((value) => {
    axiom = value
    lsystem()
  })

  guiRules.onChange((value) => {
    rules = []
    const t = value.split(',')
    while (t[0]) {
      rules.push(t.splice(0, 2))
    }
    lsystem()
  })

  guiAngle.onChange((value) => {
    angle = value
    lsystem()
  })

  guiStepLength.onChange((value) => {
    stepLength = value
    lsystem()
  })
}

lsystem()
