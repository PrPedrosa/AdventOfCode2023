export const getNextNum = (seed, mapper) => {
	const mapToUse = mapper.filter(
		m => seed >= m.sourceRangeStart && seed < m.sourceRangeStart + m.rangeLength
	)
	if (!mapToUse.length) return seed
	const diff = seed - mapToUse[0].sourceRangeStart
	return mapToUse[0].destinationRangeStart + diff
}

export const getLocationFromRange = (range, maps) => {
	let seed = Number(range[0])
	let actualRange = Number(range[1])
	let lowestLoc = null
	for (let i = 0; i <= actualRange; i++) {
		let num = null
		for (let j = 0; j < Object.keys(maps).length; j++) {
			num = getNextNum(num ? num : seed, maps[(j + 1).toString()])
		}
		seed += 1
		if (lowestLoc === null || num <= lowestLoc) lowestLoc = num
	}
	return lowestLoc
}
