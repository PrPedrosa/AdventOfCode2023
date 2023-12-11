import { INPUT } from "./input.js"

const digitsAndWordsRegEx = /[0-9]/g
const wordsMap = {
	one: "1",
	two: "2",
	three: "3",
	four: "4",
	five: "5",
	six: "6",
	seven: "7",
	eight: "8",
	nine: "9"
}

const valuesArray = INPUT.map(str => {
	const values = str.match(digitsAndWordsRegEx)
	const coords = [values[0], values[values.length - 1]]

	/* const parsedCoords = coords.map(num => {
		if (Object.keys(wordsMap).includes(num)) return wordsMap[num]
		return num
	}) */
	console.log(str, coords.join(""))
	return coords.join("")
})

console.log(valuesArray.reduce((a, b) => a + Number(b), 0))
