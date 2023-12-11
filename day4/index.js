import { Console } from "console"
import fs from "fs"
import path from "path"

const data = fs.readFileSync(path.resolve("day4/day4.txt"), "utf8")

// PUZZLE 1 https://adventofcode.com/2023/day/4#part1
/* const cards = data.split("\n")
let count = 0
cards.forEach(card => {
	const cardNums = card
		.substring(card.indexOf("|") + 1)
		.split(" ")
		.filter(str => str !== "")
		.map(str => {
			if (str.includes("\r")) {
				return str.substring(0, str.indexOf("\r"))
			}
			return str
		})
	const winNums = card
		.substring(card.indexOf(":") + 1, card.indexOf("|"))
		.split(" ")
		.filter(str => str !== "")

	let cardCount = 0
	for (let i = 0; i < cardNums.length; i++) {
		if (winNums.includes(cardNums[i])) {
			if (cardCount === 0) cardCount = 1
			else cardCount *= 2
		}
	}
	count += cardCount
})
console.log(count) */

// PUZZLE 2 https://adventofcode.com/2023/day/4#part2
const parseData = data => {
	const cards = data.split("\n")
	return cards.map(card => {
		const id = card.substring(card.indexOf(" "), card.indexOf(":")).trimStart()
		const cardNums = card
			.substring(card.indexOf("|") + 1)
			.split(" ")
			.filter(str => str !== "")
			.map(str => {
				if (str.includes("\r")) {
					return str.substring(0, str.indexOf("\r"))
				}
				return str
			})
		const winNums = card
			.substring(card.indexOf(":") + 1, card.indexOf("|"))
			.split(" ")
			.filter(str => str !== "")
		return { id, winNums, cardNums }
	})
}
const original = parseData(data)

const cache = {}

//build cache
original.forEach(card => {
	if (card.id === "203") return
	const { id, winNums, cardNums } = card
	let nextCardId = +id + 1

	cardNums.forEach(num => {
		if (winNums.includes(num)) {
			const nextCard = {
				id: nextCardId,
				winNums: original[nextCardId - 1].winNums,
				cardNums: original[nextCardId - 1].cardNums
			}
			nextCardId++
			if (cache[id]) cache[id].push(nextCard)
			else cache[id] = [nextCard]
		}
	})
})
//console.log(cache)

//get card count
/**@param {{id:string, winNums:string[], cardNums: string[]}[]} cards */
const getCardCount = (cards, count = 0) => {
	const copies = []
	//console.log("helloo", cards.length)
	if (!cards.length) return count

	for (let i = 0; i < cards.length; i++) {
		const { id } = cards[i]
		if (cache[id]) copies.push(...cache[id])
		count++
	}
	return getCardCount(copies, count)
}

const start = performance.now()
const test = getCardCount(original)

//trying out solutions performance 1
/* let test = 0
for (let i = 0; i < original.length; i++) {
	console.log("iterations", i + 1)
	const count = getCardCount([original[i]])
	test += count
} */

//trying out solutions 2
/* const chunks = [
	[...original.slice(0, 40)],
	[...original.slice(40, 80)],
	[...original.slice(80, 120)],
	[...original.slice(120, 140)],
	[...original.slice(140, 170)],
	[...original.slice(170)]
]
const allChunks = [
	getCardCount(chunks[0]),
	getCardCount(chunks[1]),
	getCardCount(chunks[2]),
	getCardCount(chunks[3]),
	getCardCount(chunks[4]),
	getCardCount(chunks[5])
]
const test = await Promise.all(allChunks) */

const finish = performance.now() - start
console.log("TIME:", finish, "ms")
console.log("RESULT", test)
