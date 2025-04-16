const http = require('http')
const fs = require('fs')

const PORT = 2000

db = JSON.parse(fs.readFileSync('db.json'))

console.log(db.length, 'стихов: ')
db.forEach(data => console.log(' -*-', data.title))
console.log()

html = fs.readFileSync('templates/1.html')

db.forEach(data => {
	html += `
<div class="stih" id="${data.id}">
<h2><a href="#${data.id}">${data.title}</a></h2>
<pre>`
	NEWLINE = false
	data.text.forEach(line => {
		if (NEWLINE)
			html += '\n'
		else
			NEWLINE = true
		html += line
	})
	html += `</pre>
</div>
`
})

html += fs.readFileSync('templates/2.html')

fs.writeFileSync('www/index.html', html)

console.log('HTML-файл успешно создан!\n')

const server = http.createServer((req, res) => {
	const url = new URL(req.url, 'https://localhost')
	p = url.pathname.split('/').filter((item) => {
		return item != ''
	})
	if (p[0] == 'db' || p[0] == 'db.json' || p[0] == 'json') {
		data = fs.readFileSync('db.json')
		res.setHeader('Content-Type', 'application/json')
		res.end(data)
	}
	else if (p.length == 0) {
		data = fs.readFileSync('www/index.html')
		res.end(data)
	}
	else {
		data = fs.readFileSync('www' + url.pathname)
		res.end(data)
	}
})

server.listen(PORT, console.log(`Сервер успешно запущен на порту ${PORT}!`))
