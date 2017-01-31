const fs = require('fs')

const accesspatternsJsonFilePath = process.argv[2]

if(!accesspatternsJsonFilePath){
	console.log(new Error("Path of accesspatterns json file must be specified."))
	process.exit()
}

console.log("API Documentation will be generated ...")

const accesspatterns = JSON.parse(fs.readFileSync(accesspatternsJsonFilePath, 'utf-8'))
//console.log(accesspatterns)

const h1 = (s) => `\n# ${s}\n`
const h2 = (s) => `\n## ${s}\n`
const h3 = (s) => `\n### ${s}\n`
const h4 = (s) => `\n#### ${s}\n`
const h5 = (s) => `\n##### ${s}\n`
const h6 = (s) => `\n###### ${s}\n`

const i = (s) => `*${s}*`
const b = (s) => `**${s}**`
const tab = (s) => `> ${s}`

const link = (url, s) => s ? `[${s}](${url})` : `[${url}](${url})`

const splitCamelCase = (s) => s.replace(/([a-z](?=[A-Z]))/g, '$1 ')
const firstLetterUpperCase = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const toList = (arr) => arr.map(e => `* ${e}`).join('\n')

const patternToMarkdown = (ap) => {
	const heading = h2(firstLetterUpperCase(splitCamelCase(ap.name))) 
	const description = tab( i(ap.description) )
	
	const url = i(ap.method + ' api/' + ap.name)
	const auth = ap.authRequired ? "Authentication is required!" : "Authentication is NOT required!"
	
	const params = toList(ap.params)
	const queries = toList(ap.queries)
	// iterate over params and description to extract them using forEach
	return [
		heading,
		description,
		h6("info"), 
		url,
		auth,
		h6("params"), 
		params,
		h6("queries"),
		queries
	].join('\n\n')
}

const apidoc = 
h1("API Documentation") + 
accesspatterns
	.map(patternToMarkdown)
	.join('\n\n')

fs.writeFileSync('doc/apidoc.md', apidoc, { encoding:'utf-8' })

console.log("Done!")
console.log("see doc/apidoc.md")