'use strict'

const countries = require('./countries.json')
const shuffle = require('lodash.shuffle')
const numberFormatter = require('number-formatter')

// const toGermanNo = (e) => numberFormatter('#.##0,##', e)
const toEnglishNo = (e) => numberFormatter('#,##0.##', e)

let currentSet
let locked = false
let highscore = 0

const categories = {
	'population': 'Population',
	'density': 'Density',
	'area': 'Area'
}

const units = {
	'population': '',
	'density': ' per km²',
	'area': ' km²'
}

const setSign = (sign) => document.querySelector("#sign").innerHTML = sign
const setCategory = (category) => document.querySelector("#category").innerHTML = categories[category]
const setHighscore = (hs) => document.querySelector("#highscore").innerHTML = hs

const setColorClass = (c) => {
	document.querySelectorAll(".fact").forEach((e) => e.setAttribute('class', 'fact '+c))
	document.querySelector("#sign").setAttribute('class', c)
}

const setSide = (lr, items, category, fact) => {
	document.querySelector('#'+lr).querySelector('.flag').setAttribute("src", items.flag)
	document.querySelector('#'+lr).querySelector('.name').innerHTML = items.name
	if(fact) document.querySelector('#'+lr).querySelector('.fact').innerHTML = toEnglishNo(items.value) + units[category]
	else document.querySelector('#'+lr).querySelector('.fact').innerHTML = '?'
}

const generateSet = () => {
	const shuffled = shuffle(countries)
	const left = shuffled[0]
	const right = shuffled[1]

	const category = shuffle(Object.keys(categories))[0]

	let correct
	if(left[category] >= right[category]) correct = 'left'
	else correct = 'right'

	return ({
		items: {
			left: {
				name: left.name,
				flag: left.flag,
				value: left[category]
			},
			right: {
				name: right.name,
				flag: right.flag,
				value: right[category]
			}
		},
		category: category,
		correct
	})
}

const reset = () => {
	locked = false
	setHighscore(highscore)
	setColorClass('normal')
	currentSet = generateSet()
	setCategory(currentSet.category)
	setSide("left", currentSet.items.left, currentSet.category, false)
	setSide("right", currentSet.items.right, currentSet.category, false)
}

const result = (lr) => {
	locked = true
	if(lr === currentSet.correct){
		setColorClass('right')
		highscore++
		setHighscore(highscore)
	}
	else{
		setColorClass('wrong')
		setHighscore(highscore)
		highscore = 0
	}
	setSide("left", currentSet.items.left, currentSet.category, true)
	setSide("right", currentSet.items.right, currentSet.category, true)
}

reset()

document.querySelector("#left").addEventListener('mouseover', (e) => !locked ? setSign('>') : null)
document.querySelector("#right").addEventListener('mouseover', (e) => !locked ? setSign('<') : null)

document.querySelector("#left").addEventListener('click', () => !locked ? result("left") : reset())
document.querySelector("#right").addEventListener('click', () => !locked ? result("right") : reset())
