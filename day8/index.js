import { log } from "console"
import os from "os"
import fs from "fs"

const data = fs.readFileSync("day8/day8.txt", "utf8").split("\r\n")

const instructions = data[0]
const coordinates = data.slice(2).map(str => ({
	in: str.substring(0, 3),
	out: {
		L: str.substring(str.indexOf("(") + 1, str.indexOf(",")),
		R: str.substring(str.indexOf(",") + 2, str.indexOf(")"))
	}
}))

//############ PUZZLE 1 ##############
/* let currentStep = coordinates.find(coords => coords.in === "AAA")
let stepCount = 0
let instructionCount = 0

while (currentStep.in !== "ZZZ") {
	const instruction = instructions[instructionCount]
	log("current", currentStep.in, stepCount)

	let nextStep = coordinates.find(step => step.in === currentStep.out[instruction])
	if (!nextStep) throw new Error("no step gfound")

	currentStep = nextStep
	stepCount++
	if (!instructions[instructionCount + 1]) {
		instructionCount = 0
	} else instructionCount++
}
log(stepCount) */

//######################## PUZZLE 2 #################################
let currentSteps = coordinates.filter(coord => coord.in[2] === "A")
let stepCount = 0
let instructionCount = 0

const cache = {}
const start = performance.now()

setInterval(() => {
	const timer = performance.now()
	log("PROCESSED", stepCount, "steps")
	log("Time running:", (timer - start) / 60000, "minutes")
}, 10000)

while (currentSteps.filter(coord => coord.in[2] === "Z").length !== 6) {
	const instruction = instructions[instructionCount]

	let nextSteps = currentSteps.map(step => {
		const next = cache[step.out[instruction]] || coordinates.find(coords => coords.in === step.out[instruction])
		if (!cache[step.out[instruction]]) cache[step.out[instruction]] = next
		return next
	})
	currentSteps = nextSteps

	stepCount++
	if (!instructions[instructionCount + 1]) {
		instructionCount = 0
	} else instructionCount++
}

/* for (let i = 0; i < 10000000; i++) {
	const instruction = instructions[instructionCount]

	currentSteps = currentSteps.map(step => {
		const next = cache[step.out[instruction]] || coordinates.find(coords => coords.in === step.out[instruction])
		if (!cache[step.out[instruction]]) cache[step.out[instruction]] = next
		return next
	})

	//currentSteps = nextSteps

	stepCount++

	if (!instructions[instructionCount + 1]) {
		instructionCount = 0
	} else instructionCount++
} */
const end = performance.now()
log("RESULT", stepCount)
log("TIME:", (end - start) / 1000, "s")
