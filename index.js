import { execSync } from "node:child_process"

//args wants to be a root folder name (ex: day1)
const args = process.argv.slice(2)
console.log("args:", args)

if (args.length > 0) {
	//inherit stdio to see logs on command line
	execSync(`node ${args[0]}/index.js`, { stdio: "inherit" })
} else {
	throw new Error("NO args given to command")
}
