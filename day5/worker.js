import { parentPort } from "worker_threads"

parentPort.on("message", (job) => {
  console.log("HELLO form worker", job.range)

  const getNextNum = (seed, mapper) => {
    const mapToUse = mapper.filter(
      (m) =>
        seed >= m.sourceRangeStart && seed <= m.sourceRangeStart + m.rangeLength
    )
    if (!mapToUse.length) return seed
    const diff = seed - mapToUse[0].sourceRangeStart
    return mapToUse[0].destinationRangeStart + diff
  }
  const getLocationFromRange = (range, maps) => {
    const startingSeed = Number(range[0])
    let lowestLoc = -1
    for (let i = 0; i < Number(range[1]); i++) {
      let seed = startingSeed + i
      let num = null
      for (let j = 0; j < Object.keys(maps).length; j++) {
        num = getNextNum(num ? num : seed, maps[(j + 1).toString()])
      }
      if (lowestLoc < 0 || num <= lowestLoc) lowestLoc = num
    }
    return lowestLoc
  }

  const location = getLocationFromRange(job.range, job.maps)
  parentPort.postMessage(location)
})
