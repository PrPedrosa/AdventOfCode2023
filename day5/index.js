import fs from "fs"

const data = fs.readFileSync("day5/day5.txt", "utf8")
const seedsString = data.split("\n")[0].substring(7)

const maps = data
	.split("\r\n")
	.filter((s, i) => s.length && i !== 0)
	.reduce((obj, str) => {
		if (/\d/.test(str)) {
			const key = Object.keys(obj).length
			obj[key].push({
				destinationRangeStart: +str.substring(0, str.indexOf(" ")),
				sourceRangeStart: +str.substring(
					str.indexOf(" ") + 1,
					str.lastIndexOf(" ")
				),
				rangeLength: +str.substring(str.lastIndexOf(" ") + 1)
			})
		} else {
			const key = Object.keys(obj).length + 1
			obj[key] = []
		}
		return obj
	}, {})

const getNextNum = (seed, mapper) => {
	const mapToUse = mapper.find(
		m =>
			seed >= m.sourceRangeStart && seed <= m.sourceRangeStart + m.rangeLength
	)
	if (!mapToUse) return seed

	const diff = seed - mapToUse.sourceRangeStart
	return mapToUse.destinationRangeStart + diff
}

// PUZZLE 1
/* const seeds = seedsString.substring(0, seedsString.length - 1).split(" ")

const locations = seeds.map(seed => {
	let num = null
	for (let i = 0; i < Object.keys(maps).length; i++) {
		num = getNextNum(num ? num : +seed, maps[(i + 1).toString()])
	}
	return num
})
console.log(locations.reduce((a, b) => (b < a ? b : a))) */

// PUZZLE 2 NEEDS REFACTORING, TOO MANY SEEDS FOR a straightforward solution, maybe try node workers? or simply chunking the arrays
const seedsRanges = seedsString
	.substring(0, seedsString.length - 1)
	.split(" ")
	.reduce((a, b, i, arr) => {
		if (i % 2 !== 0) a.push([+arr[i - 1], +b])
		return a
	}, [])

const getSeedsFromRange = range => {
	const startingSeed = range[0]
	const seeds = [startingSeed]
	for (let i = 0; i < range[1]; i++) {
		seeds.push(startingSeed + i + 1)
	}
	return seeds
}

let location = null
let seedsProcessed = 0
let total = []

for (let i = 0; i < seedsRanges.length; i++) {
	const newSeeds = getSeedsFromRange(seedsRanges[i])

	total.push(newSeeds.length)
	/* newSeeds.forEach(seed => {
		let num = null
		for (let i = 0; i < Object.keys(maps).length; i++) {
			num = getNextNum(num ? num : +seed, maps[(i + 1).toString()])
		}
		if (!location || num < location) location = num
		seedsProcessed++
		console.log(seedsProcessed)
	}) */
}
console.log(total)
console.log(location)
