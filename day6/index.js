import { log } from "console"
import fs from "fs"
import os from "os"

const data = fs.readFileSync("day6/day6.txt", "utf8")
const times = data
  .split("\n")[0]
  .replace(/[^\d\s]/g, "")
  .split(" ")
  .filter((s) => !(s === ""))

const distances = data
  .split("\n")[1]
  .replace(/[^\d\s]/g, "")
  .split(" ")
  .filter((s) => !(s === ""))

const timePerDistance = times.map((time, i) => [time, distances[i]])
log(timePerDistance)
