export const cardTypes = {
	FiveKind: "FiveKind",
	FourKind: "FourKind",
	FullHouse: "FullHouse",
	ThreeKind: "ThreeKind",
	TwoPair: "TwoPair",
	OnePair: "OnePair",
	HighCard: "HighCard"
}

export const cardPower = {
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14
}

export const cardPowerPuzzle2 = {
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	J: 1,
	Q: 12,
	K: 13,
	A: 14
}

export const getTypeOfHand = cards => {
	const instancesOfCards = {}
	cards.split("").forEach(card => {
		if (!instancesOfCards[card]) return (instancesOfCards[card] = 1)
		return instancesOfCards[card]++
	})
	let ans = ""
	for (const card in instancesOfCards) {
		ans += instancesOfCards[card].toString()
	}
	if (ans.length === 1) return cardTypes.FiveKind
	if (ans.length === 2) {
		if (ans.split("").includes("1")) return cardTypes.FourKind
		return cardTypes.FullHouse
	}
	if (ans.length === 3) {
		if (ans.split("").includes("3")) return cardTypes.ThreeKind
		return cardTypes.TwoPair
	}
	if (ans.length === 4) return cardTypes.OnePair
	return cardTypes.HighCard
}
