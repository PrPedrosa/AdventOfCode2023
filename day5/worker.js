import { parentPort } from "worker_threads"
import { getLocationFromRange } from "./utils.js"

parentPort.on("message", job => {
	console.log("HELLO form worker", job.id, job.range)

	const locations = [
		getLocationFromRange(job.range[0], job.maps),
		getLocationFromRange(job.range[1], job.maps)
	]
	parentPort.postMessage(locations)
})
