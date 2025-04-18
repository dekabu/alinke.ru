const http = require('http')
const https = require('https')
const fs = require('fs')

var HTTPS 

if (fs.existsSync('config.json')) {
	config = JSON.parse(fs.readFileSync('config.json'))

	HTTPS = config.HTTPS

	PORT = config.PORT
}
else {
	HTTPS = true	
	PORT = 443
}

console.log(`HTTP${HTTPS ? 's' : ''}, ${PORT} порт.\n`)

const serv_type = HTTPS ? https : http

const options = HTTPS ? {
	key: fs.readFileSync('/etc/letsencrypt/live/alinke.ru/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/alinke.ru/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/alinke.ru/chain.pem'),
} : {}

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

const server = serv_type.createServer(options, (req, res) => {

	date = new Date()

	const url = new URL(req.url, 'https://localhost')

	console.error(`${date} ${req.socket.remoteAddress} сделал запрос: ${url.pathname}`)

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
		p = 'www' + url.pathname

		if (fs.existsSync(p)) {
			data = fs.readFileSync('www' + url.pathname)
			res.end(data)
		}
		else
			res.end('File is not found! :(')
	}
})

server.listen(PORT, console.log(`Сервер успешно запущен!`))
