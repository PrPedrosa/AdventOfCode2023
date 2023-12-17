import { log } from "console"
import assert from "node:assert/strict"
import fs from "fs"
import { cardPower, cardPowerPuzzle2, cardTypes, getTypeOfHand } from "./utils.js"

const data = fs.readFileSync("day7/day7.txt", "utf8").split("\r\n")

//############ PUZZLE 1 ##############
const hands = data.map(hand => {
	const cards = hand.substring(0, 5)
	const bid = +hand.substring(6)
	return {
		cards: cards,
		bid: bid,
		type: getTypeOfHand(cards)
	}
})
//log(hands)
hands.forEach(hand => {
	assert.deepEqual(hand.cards.length, 5)
})

const sortByPower = (handA, handB) => {
	for (let i = 0; i < 5; i++) {
		if (cardPower[handA.cards[i]] > cardPower[handB.cards[i]]) return 1
		if (cardPower[handA.cards[i]] < cardPower[handB.cards[i]]) return -1
	}
}

const filterByType = (allHands, type) => allHands.filter(hand => hand.type === cardTypes[type])

const fiveKindHands = filterByType(hands, cardTypes.FiveKind).sort(sortByPower)
const fourKindHands = filterByType(hands, cardTypes.FourKind).sort(sortByPower)
const fullHouseHands = filterByType(hands, cardTypes.FullHouse).sort(sortByPower)
const threeKindHands = filterByType(hands, cardTypes.ThreeKind).sort(sortByPower)
const twoPairHands = filterByType(hands, cardTypes.TwoPair).sort(sortByPower)
const onePairHands = filterByType(hands, cardTypes.OnePair).sort(sortByPower)
const highCardHands = filterByType(hands, cardTypes.HighCard).sort(sortByPower)

const sortedHands = [
	...highCardHands,
	...onePairHands,
	...twoPairHands,
	...threeKindHands,
	...fullHouseHands,
	...fourKindHands,
	...fiveKindHands
]

const rankedHands = sortedHands.map((hand, i) => ({ ...hand, rank: i + 1 }))

const result = rankedHands.reduce((sum, hand) => {
	return sum + hand.bid * hand.rank
}, 0)

//log("RANKED HANDS", rankedHands)
log("RESULT", result)

//########### PUZZLE 2 ###########

const upgradeJHands = hand => {
	if (!hand.cards.split("").includes("J")) return hand

	const { HighCard, OnePair, TwoPair, ThreeKind, FullHouse, FourKind, FiveKind } = cardTypes

	switch (hand.type) {
		case HighCard:
			return { ...hand, type: OnePair }

		case OnePair:
			return { ...hand, type: ThreeKind }

		case TwoPair:
			if (hand.cards.replace("J", "a").split("").includes("J")) return { ...hand, type: FourKind }
			return { ...hand, type: FullHouse }

		case ThreeKind:
			return { ...hand, type: FourKind }

		case FullHouse:
		case FourKind:
			return { ...hand, type: FiveKind }

		default:
			return hand
	}
}

const puzzle2Hands = sortedHands.map(hand => upgradeJHands(hand))

const sortByPowerPuzzle2 = (handA, handB) => {
	for (let i = 0; i < 5; i++) {
		if (cardPowerPuzzle2[handA.cards[i]] > cardPowerPuzzle2[handB.cards[i]]) return 1
		if (cardPowerPuzzle2[handA.cards[i]] < cardPowerPuzzle2[handB.cards[i]]) return -1
	}
}

const sortedHandsPuzzle2 = [
	...filterByType(puzzle2Hands, cardTypes.HighCard).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.OnePair).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.TwoPair).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.ThreeKind).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.FullHouse).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.FourKind).sort(sortByPowerPuzzle2),
	...filterByType(puzzle2Hands, cardTypes.FiveKind).sort(sortByPowerPuzzle2)
]

const rankedPuzzle2Hands = sortedHandsPuzzle2.map((hand, i) => ({ ...hand, rank: i + 1 }))

const resultPuzzle2 = rankedPuzzle2Hands.reduce((sum, hand) => {
	return sum + hand.bid * hand.rank
}, 0)

//log("RANKED PUZZLE 2 HANDS", rankedPuzzle2Hands)
log("RESULT", resultPuzzle2)
