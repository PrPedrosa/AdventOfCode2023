import { log } from "console"
import fs from "fs"
import { Worker } from "worker_threads"
import { getLocationFromRange, getNextNum } from "./utils.js"
import os from "os"

const data = fs.readFileSync("day5/day5.txt", "utf8")

const maps = data
	.split("\r\n") //##### LINUX - \n , WINDOWS - \r\n
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

const seedsString = data.split("\r\n")[0].substring(7) //##### LINUX - \n , WINDOWS - \r\n

// ######## PUZZLE 1 #######
const seeds = seedsString.substring(0, seedsString.length - 1).split(" ")

const locationsP1 = seeds.map(seed => {
	let num = null
	for (let i = 0; i < Object.keys(maps).length; i++) {
		num = getNextNum(num ? num : +seed, maps[(i + 1).toString()])
	}
	return num
})
log(locationsP1.reduce((a, b) => (b < a ? b : a)))

// ######## PUZZLE 2 with/without node workers, without - around 50min, with - around 20min ########
const seedsRanges = seedsString
	.substring(0, seedsString.length)
	.split(" ")
	.reduce((a, b, i, arr) => {
		if (i % 2 !== 0) a.push([arr[i - 1], b])
		return a
	}, [])

// ####### Solution without workers ########
/* 
let locations = []

log("RANGES", seedsRanges)

for (let i = 0; i < seedsRanges.length; i++) {
	const tock = performance.now()

	log("WORKING ON RANGE....", seedsRanges[i])
	locations.push(getLocationFromRange(seedsRanges[i], maps))
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
for (let i = 0; i < seedsRanges.length; i += 2) {
	const job = {
		id: (i + 2) / 2,
		range: [seedsRanges[i], seedsRanges[i + 1]],
		maps: maps
	}
	findLocationJobs.push(job)
}
log("JOBS", findLocationJobs)

const lowestLocations = []

const run = async (jobs, concurrentWorkers) => {
	const start = performance.now()
	let completedWorkers = 0

	jobs.forEach(job => {
		const worker = new Worker("./day5/worker.js")
		worker.postMessage(job)

		worker.on("message", locs => {
			completedWorkers++
			const jobEnd = performance.now()

			log(`Worker ${job.id} completed with locations:${locs}`)
			log(`Worker ${job.id} took: ${(jobEnd - start) / 1000} seconds`)

			lowestLocations.push(...locs)

			if (completedWorkers === concurrentWorkers) {
				const end = performance.now()
				log(`ALL workers took ${(end - start) / 60000} minutes to finish`)
				log("All lowest locations by range:", lowestLocations)
				log(lowestLocations.reduce((a, b) => (a < b ? a : b)))
				process.exit()
			}
		})
	})
}

//RUN with 5 only (machine needs to have 5 cpus)
log("number of cores here", os.cpus().length)
await run(findLocationJobs, 5)

// trying dynamic logging
let plsWait = "brute forcing it, plsWait"
let dots = ["", ".", "..", "..."]
let i = 0
setInterval(() => {
	process.stdout.write(`\r${plsWait}${dots[i]}`)
	process.stdout.clearLine(1) // because this is from current cursor position going to the right
	i = i === 3 ? 0 : i + 1
}, 700)
//################## END OF Workers experiment ########################
