import { log } from "console"
import fs from "fs"

const data = fs.readFileSync("day9/day9.txt", "utf8").split("\n")
const parsed = data.map(str => str.split(" "))

const getNextSequence = sequence =>
  sequence.reduce((res, num, i, arr) => {
    if (arr[i + 1] === undefined) return res
    res.push(arr[i + 1] - num)
    return res
  }, [])

const isLastSequence = sequence => !sequence.some(el => el !== 0)

// ########## PUZZLE 1 #########
// loop through all the sequences of a root sequence to find the next num on the root sequence
const findNextNum = arrayOfSequences =>
  arrayOfSequences.reduceRight((num, sequence) => num + sequence[sequence.length - 1], 0)

const numsToSum = []

parsed.forEach(seq => {
  const rootSequence = seq.map(str => Number(str))
  const allSequences = [rootSequence]

  // from the root sequence, keep finding the next sequence and push to allSequences
  // stop when next sequence is the last (only zeroes)
  while (!isLastSequence(allSequences[allSequences.length - 1])) {
    const nextSequence = allSequences[allSequences.length - 1]
    allSequences.push(getNextSequence(nextSequence))
  }
  numsToSum.push(findNextNum(allSequences))
})

const answerPuzzle1 = numsToSum.reduce((a, b) => a + b)
log(answerPuzzle1)

// ########## PUZZLE 2 #########
// loop through all the sequences of a root sequence to find the previous num on the root sequence
const findPrevNum = arrayOfSequences => arrayOfSequences.reduceRight((num, sequence) => sequence[0] - num, 0)

const numsToSumPuzzle2 = []

parsed.forEach(seq => {
  const sequence = seq.map(str => Number(str))
  const allSequences = [sequence]

  while (!isLastSequence(allSequences[allSequences.length - 1])) {
    const nextSequence = allSequences[allSequences.length - 1]
    allSequences.push(getNextSequence(nextSequence))
  }
  numsToSumPuzzle2.push(findPrevNum(allSequences))
})

const answerPuzzle2 = numsToSumPuzzle2.reduce((a, b) => a + b)
log(answerPuzzle2)
