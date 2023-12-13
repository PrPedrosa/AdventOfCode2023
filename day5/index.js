import { log } from "console"
import fs from "fs"
import { Worker } from "worker_threads"

const data = fs.readFileSync("day5/day5.txt", "utf8")

const maps = data
	.split("\n")
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
	const mapToUse = mapper.filter(
		m =>
			seed >= m.sourceRangeStart && seed <= m.sourceRangeStart + m.rangeLength
	)
	if (!mapToUse.length) return seed
	const diff = seed - mapToUse[0].sourceRangeStart
	return mapToUse[0].destinationRangeStart + diff
}

const seedsString = data.split("\r\n")[0].substring(7) //##### LINUX - \n , WINDOWS - \r\n
// PUZZLE 1
/* const seeds = seedsString.substring(0, seedsString.length - 1).split(" ")

const locations = seeds.map(seed => {
	let num = null
	for (let i = 0; i < Object.keys(maps).length; i++) {
		num = getNextNum(num ? num : +seed, maps[(i + 1).toString()])
	}
	return num
})
log(locations.reduce((a, b) => (b < a ? b : a))) */

// PUZZLE 2 NEEDS REFACTORING, TOO MANY SEEDS FOR a straightforward solution, maybe try node workers? or simply chunking the arrays
// No idea whats wrong :(
const seedsRanges = seedsString
	.substring(0, seedsString.length)
	.split(" ")
	.reduce((a, b, i, arr) => {
		if (i % 2 !== 0) a.push([arr[i - 1], b])
		return a
	}, [])

const getLocationFromRange = range => {
	const startingSeed = range[0]
	let lowestLoc = -1
	for (let i = 0; i < range[1]; i++) {
		let seed = Number(startingSeed) + i
		let num = null
		for (let j = 0; j < Object.keys(maps).length; j++) {
			num = getNextNum(num ? num : seed, maps[(j + 1).toString()])
		}
		if (lowestLoc < 0 || num <= lowestLoc) lowestLoc = num
	}
	return lowestLoc
}

/* let locations = []

log("RANGES", seedsRanges)

for (let i = 0; i < seedsRanges.length; i++) {
	const tock = performance.now()

	log("WORKING ON RANGE....", seedsRanges[i])
	locations.push(getLocationFromRange(seedsRanges[i]))
	const tick = performance.now()
	log("FINISHED, TOOK:", (tick - tock) / 1000, "seconds")
}

log("LOCATIONS", locations)
log(
	"ANSWER",
	locations.reduce((a, b) => (a < b ? a : b))
) */

//######### NODE WORKERS EXPERIMENT ############
const findLocationJobs = []
for (let i = 0; i < seedsRanges.length; i++) {
	//const job = () => getLocationFromRange(seedsRanges[i])
	const job = {
		range: seedsRanges[i],
		maps: maps
	}
	findLocationJobs.push(job)
}
const lowestLocations = []
const run = (jobs, concurrentWorkers) => {
	const start = performance.now()
	let completedWorkers = 0
	jobs.forEach((job, i) => {
		const worker = new Worker("./day5/worker.js")
		worker.postMessage(job)
		worker.on("message", loc => {
			completedWorkers++
			log(`Worker ${i} completed with location:${loc}`)
			log(`Worker ${i} took: ${(performace.now() - start) / 1000} seconds`)
			lowestLocations.push(loc)
			if (completedWorkers === concurrentWorkers) {
				log(
					`ALL workers took ${
						(performace.now() - start) / 60000
					} minutes to finish`
				)
				process.exit()
			}
		})
	})
}
run(findLocationJobs, 2)
//################## END OF EXPERIMENT ########################
