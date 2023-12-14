import { log } from "console"
import fs from "fs"
import os from "os"

const data = fs.readFileSync("day6/day6.txt", "utf8")
const times = data
	.split("\r\n")[0] // ##### \r\n on Windows || \n on Linux #####
	.replace(/[^\d\s]/g, "")
	.split(" ")
	.filter(s => !(s === ""))
log("TIMES in milliseconds:", times)

const distances = data
	.split("\n")[1]
	.replace(/[^\d\s]/g, "")
	.split(" ")
	.filter(s => !(s === ""))
log("distances in millimeters:", distances)

const races = times.map((time, i) => ({
	time: +time,
	record: +distances[i]
}))
log("RACES:", races)

/**@param {{time: number, record: number, }} race */
function getNumOfRecords(race) {
	const results = []
	for (let i = 1; i <= race.time; i++) {
		const speed = i
		const remaingRaceTime = race.time - speed
		const distance = remaingRaceTime * speed
		results.push({ speed, distance, isRecord: distance > race.record })
	}
	return results.filter(result => result.isRecord).length
}

const result = races.reduce((result, race) => {
	const numOfRecords = getNumOfRecords(race)
	return numOfRecords * result
}, 1)
log("RESULT", result)

// PUZZLE 2
const time = +times.join("")
const record = +distances.join("")
log("TIME:", time, "DISTANCE:", record)

let numOfRecords = 0
for (let j = 1; j <= time; j++) {
	const speed = j
	const remainingTime = time - speed
	const distance = remainingTime * speed
	if (distance > record) numOfRecords++
}
log("ANSWER:", numOfRecords)
