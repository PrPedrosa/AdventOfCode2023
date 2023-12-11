import fs from "fs"
import path from "path"

const data = fs.readFileSync(path.resolve("day3/day3.txt"), "utf8")
const parsedData = data.split("\r\n").map(str => "." + str + ".")
const border = ".".repeat(142)
parsedData.push(border)
parsedData.unshift(border)

// PUZZLE 1

/* let engineCount = 0
parsedData.forEach((str, i) => {
	const matches = str.matchAll(/[0-9]+/g)
	for (const match of matches) {
		const numLength = match[0].length
		if (!match.index) throw new Error(`no index on match:${match}`)
		const before = match.index - 1
		const after = match.index + numLength
		const leftChar = str[before]
		const rightChar = str[after]
		const topString = parsedData[i - 1].substring(before, after + 1) //+1 cuz substring end is exclusive
		const bottomString = parsedData[i + 1].substring(before, after + 1)
		const symbolRegex = /[^\w\s\d.]/
		if (symbolRegex.test(leftChar + rightChar + topString + bottomString)) {
			engineCount += Number(match[0])
		}
	}
})
console.log("count:", engineCount) */

// PUZZLE 2 - Could be super refactored lul
let ratios = 0
parsedData.forEach((str, i) => {
	const matches = str.matchAll(/\*+/g)
	for (const match of matches) {
		if (!match.index) throw new Error(`no index on match:${match}`)
		const before = match.index - 1
		const after = match.index + 1
		const digitRegex = /[0-9]+/
		const leftCharNumResult = digitRegex.test(str[before]) ? 1 : 0
		const rightCharNumResult = digitRegex.test(str[after]) ? 1 : 0
		const topString = parsedData[i - 1].substring(before, after + 1) //+1 cuz substring end is exclusive
		const bottomString = parsedData[i + 1].substring(before, after + 1)
		const stringHasNum = string => {
			const hasDigit = digitRegex.test(string)
			if (!hasDigit) return 0
			if (string.match(/\d\D\d/)) return 2
			return 1
		}
		const topStringNumResult = stringHasNum(topString)
		const bottomStringNumResult = stringHasNum(bottomString)

		const gears = []
		//check if leftcharhasnum => push into gears if yes
		if (leftCharNumResult === 1) {
			let num = `${str[before]}`
			if (digitRegex.test(str[before - 1])) {
				num = `${str[before - 1]}` + num
				if (digitRegex.test(str[before - 2])) num = `${str[before - 2]}` + num
			}
			gears.push(num)
		}
		if (rightCharNumResult === 1) {
			let num = `${str[after]}`
			if (digitRegex.test(str[after + 1])) {
				num += `${str[after + 1]}`
				if (digitRegex.test(str[after + 2])) num += `${str[after + 2]}`
			}
			gears.push(num)
		}

		if (topStringNumResult === 2) {
			let num1 = topString[0]
			if (digitRegex.test(parsedData[i - 1][before - 1])) {
				num1 = `${parsedData[i - 1][before - 1]}` + num1
				if (digitRegex.test(parsedData[i - 1][before - 2]))
					num1 = `${parsedData[i - 1][before - 2]}` + num1
			}
			gears.push(num1)

			let num2 = topString[2]
			if (digitRegex.test(parsedData[i - 1][after + 1])) {
				num2 += `${parsedData[i - 1][after + 1]}`
				if (digitRegex.test(parsedData[i - 1][after + 2]))
					num2 += `${parsedData[i - 1][after + 2]}`
			}
			gears.push(num2)
		}

		if (bottomStringNumResult === 2) {
			let num1 = bottomString[0]
			if (digitRegex.test(parsedData[i + 1][before - 1])) {
				num1 = `${parsedData[i + 1][before - 1]}` + num1
				if (digitRegex.test(parsedData[i + 1][before - 2]))
					num1 = `${parsedData[i + 1][before - 2]}` + num1
			}
			gears.push(num1)

			let num2 = bottomString[2]
			if (digitRegex.test(parsedData[i + 1][after + 1])) {
				num2 += `${parsedData[i + 1][after + 1]}`
				if (digitRegex.test(parsedData[i + 1][after + 2]))
					num2 += `${parsedData[i + 1][after + 2]}`
			}
			gears.push(num2)
		}

		if (topStringNumResult === 1) {
			if (topString.match(/\d\d\d/)) gears.push(topString)
			if (topString.match(/\D\d\D/)) gears.push(topString[1])
			if (topString.match(/\d\d\D/)) {
				let num = `${topString[0]}${topString[1]}`
				if (parsedData[i - 1][before - 1].match(/\d/)) {
					num = `${parsedData[i - 1][before - 1]}` + num
				}
				gears.push(num)
			}
			if (topString.match(/\D\d\d/)) {
				let num = `${topString[1]}${topString[2]}`
				if (parsedData[i - 1][after + 1].match(/\d/)) {
					num += `${parsedData[i - 1][after + 1]}`
				}
				gears.push(num)
			}
			if (topString.match(/\D\D\d/)) {
				let num = `${topString[2]}`
				if (parsedData[i - 1][after + 1].match(/\d/)) {
					num += `${parsedData[i - 1][after + 1]}`
					if (parsedData[i - 1][after + 2].match(/\d/)) {
						num += `${parsedData[i - 1][after + 2]}`
					}
				}
				gears.push(num)
			}
			if (topString.match(/\d\D\D/)) {
				let num = `${topString[0]}`
				if (parsedData[i - 1][before - 1].match(/\d/)) {
					num = `${parsedData[i - 1][before - 1]}` + num
					if (parsedData[i - 1][before - 2].match(/\d/)) {
						num = `${parsedData[i - 1][before - 2]}` + num
					}
				}
				gears.push(num)
			}
		}

		if (bottomStringNumResult === 1) {
			if (bottomString.match(/\d\d\d/)) gears.push(bottomString)
			if (bottomString.match(/\D\d\D/)) gears.push(bottomString[1])
			if (bottomString.match(/\d\d\D/)) {
				let num = `${bottomString[0]}${bottomString[1]}`
				if (parsedData[i + 1][before - 1].match(/\d/)) {
					num = `${parsedData[i + 1][before - 1]}` + num
				}
				gears.push(num)
			}
			if (bottomString.match(/\D\d\d/)) {
				let num = `${bottomString[1]}${bottomString[2]}`
				if (parsedData[i + 1][after + 1].match(/\d/)) {
					num += `${parsedData[i + 1][after + 1]}`
				}
				gears.push(num)
			}
			if (bottomString.match(/\D\D\d/)) {
				let num = `${bottomString[2]}`
				if (parsedData[i + 1][after + 1].match(/\d/)) {
					num += `${parsedData[i + 1][after + 1]}`
					if (parsedData[i + 1][after + 2].match(/\d/)) {
						num += `${parsedData[i + 1][after + 2]}`
					}
				}
				gears.push(num)
			}
			if (bottomString.match(/\d\D\D/)) {
				let num = `${bottomString[0]}`
				if (parsedData[i + 1][before - 1].match(/\d/)) {
					num = `${parsedData[i + 1][before - 1]}` + num
					if (parsedData[i + 1][before - 2].match(/\d/)) {
						num = `${parsedData[i + 1][before - 2]}` + num
					}
				}
				gears.push(num)
			}
		}
		//do function to check for topstring and bottom, if 0 return, if 1 or 2 find the nums and push into gears
		console.log(gears)
		if (gears.length === 2) {
			ratios += gears[0] * gears[1]
		}
	}
})
console.log(ratios)
