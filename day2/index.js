import fs from "fs"
import path from "path"
import util from "util"

const data = fs.readFileSync(path.resolve("day2/day2.txt"), "utf8")
const maxCount = {
	red: 12,
	green: 13,
	blue: 14
}

const dataParsed = data
	.split("\n")
	.slice(0, 100)
	.map(str => {
		let isPossible = true

		const match = str.match(/[0-9]+/)
		if (!match) throw new Error(`no match on str:${str}`)

		const games = str
			.substring(str.indexOf(":") + 1)
			.split(";")
			.map(ballsStr => ballsStr.split(","))

		const parsedGames = games.map(game => {
			const count = {
				red: 0,
				green: 0,
				blue: 0
			}
			game.forEach(colourShown => {
				const num = Number(colourShown.match(/[0-9]+/))
				const colour = colourShown.match(/(red)|(blue)|(green)/g)[0]
				count[colour] += num
				if (maxCount[colour] < num) isPossible = false
			})
			return count
		})

		return {
			id: match[0],
			str: str,
			rounds: parsedGames,
			isPossible: isPossible
		}
	})

//PUZZLE 1
const possibleGames = dataParsed
	.filter(game => game.isPossible)
	.map(game => game.id)
	.reduce((a, b) => a + Number(b), 0)
//console.log(util.inspect(possibleGames, { depth: null, colors: true }))

//PUZZLE 2
const dataWithMinBalls = dataParsed.map(game => {
	const minCount = {
		red: 0,
		blue: 0,
		green: 0
	}
	game.rounds.forEach(round => {
		if (round.red > minCount.red) minCount.red = round.red
		if (round.blue > minCount.blue) minCount.blue = round.blue
		if (round.green > minCount.green) minCount.green = round.green
	})
	const power = minCount.red * minCount.blue * minCount.green

	return { ...game, minCount, power }
})
const powerSum = dataWithMinBalls.reduce((a, b) => a + b.power, 0)
console.log(util.inspect(powerSum, { depth: null, colors: true }))
