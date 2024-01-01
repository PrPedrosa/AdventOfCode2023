import { log } from "console"
import fs from "fs"

const data = fs.readFileSync("day10/day10.txt", "utf8").split("\n")
const parsed = data.map(str => str.split(""))

// ######## PUZZLE 1 #######
const startingRowIdx = parsed.findIndex(row => row.includes("S"))
const startingColIdx = parsed[startingRowIdx].findIndex(char => char === "S")

const northCharFromStart = parsed[startingRowIdx - 1][startingColIdx]
const southCharFromStart = parsed[startingRowIdx + 1][startingColIdx]
const eastCharFromStart = parsed[startingRowIdx][startingColIdx + 1]
const westCharFromStart = parsed[startingRowIdx][startingColIdx - 1]
log(northCharFromStart) // cannot start here, "-" char but not connected to "S"
log(southCharFromStart) // can start, "L" char
log(eastCharFromStart) // cannot start here, "." char
log(westCharFromStart) // can start, "F" char

// returns the next element in the pipe, its row and col Indexes and the position from where the pipe got there
// cannot do a recursive call because of stack overflow
// could also do a switch statement but meh
const runThePipe = (char, rowIdx, colIdx, prevPos) => {
  let nextChar, nextRow, nextCol, nextPrevPos
  if (char === ".") throw new Error("pipe didnt loop")

  if (char === "L") {
    if (prevPos === "north") {
      nextPrevPos = "west"
      nextChar = parsed[rowIdx][colIdx + 1]
      nextRow = rowIdx
      nextCol = colIdx + 1
    } else if (prevPos === "east") {
      nextPrevPos = "south"
      nextChar = parsed[rowIdx - 1][colIdx]
      nextRow = rowIdx - 1
      nextCol = colIdx
    } else throw new Error(`char is L but prevPos is wrong - ${prevPos}`)
  }

  if (char === "7") {
    if (prevPos === "south") {
      nextPrevPos = "east"
      nextChar = parsed[rowIdx][colIdx - 1]
      nextRow = rowIdx
      nextCol = colIdx - 1
    } else if (prevPos === "west") {
      nextPrevPos = "north"
      nextChar = parsed[rowIdx + 1][colIdx]
      nextRow = rowIdx + 1
      nextCol = colIdx
    } else throw new Error(`char is 7 but prevPos is wrong - ${prevPos}`)
  }

  if (char === "F") {
    if (prevPos === "south") {
      nextPrevPos = "west"
      nextChar = parsed[rowIdx][colIdx + 1]
      nextRow = rowIdx
      nextCol = colIdx + 1
    } else if (prevPos === "east") {
      nextPrevPos = "north"
      nextChar = parsed[rowIdx + 1][colIdx]
      nextRow = rowIdx + 1
      nextCol = colIdx
    } else throw new Error(`char is F but prevPos is wrong - ${prevPos}`)
  }

  if (char === "J") {
    if (prevPos === "north") {
      nextPrevPos = "east"
      nextChar = parsed[rowIdx][colIdx - 1]
      nextRow = rowIdx
      nextCol = colIdx - 1
    } else if (prevPos === "west") {
      nextPrevPos = "south"
      nextChar = parsed[rowIdx - 1][colIdx]
      nextRow = rowIdx - 1
      nextCol = colIdx
    } else throw new Error(`char is J but prevPos is wrong - ${prevPos}`)
  }

  if (char === "-") {
    if (prevPos === "east") {
      nextPrevPos = "east"
      nextChar = parsed[rowIdx][colIdx - 1]
      nextRow = rowIdx
      nextCol = colIdx - 1
    } else if (prevPos === "west") {
      nextPrevPos = "west"
      nextChar = parsed[rowIdx][colIdx + 1]
      nextRow = rowIdx
      nextCol = colIdx + 1
    } else throw new Error(`char is - but prevPos is wrong - ${prevPos}`)
  }

  if (char === "|") {
    if (prevPos === "south") {
      nextPrevPos = "south"
      nextChar = parsed[rowIdx - 1][colIdx]
      nextRow = rowIdx - 1
      nextCol = colIdx
    } else if (prevPos === "north") {
      nextPrevPos = "north"
      nextChar = parsed[rowIdx + 1][colIdx]
      nextRow = rowIdx + 1
      nextCol = colIdx
    } else throw new Error(`char is | but prevPos is wrong - ${prevPos}`)
  }

  return {
    nextChar,
    nextRow,
    nextCol,
    nextPrevPos,
  }
}

let currentChar = southCharFromStart
let currentRowIdx = startingRowIdx + 1
let currentColIdx = startingColIdx
let currentPrevPos = "north"
let pipeLength = 1

while (currentChar !== "S") {
  const { nextChar, nextRow, nextCol, nextPrevPos } = runThePipe(
    currentChar,
    currentRowIdx,
    currentColIdx,
    currentPrevPos
  )
  currentChar = nextChar
  currentRowIdx = nextRow
  currentColIdx = nextCol
  currentPrevPos = nextPrevPos
  pipeLength++
}
log(pipeLength / 2) // Answer is half the length of the pipe

// ######## PUZZLE 2 ########
