const http    = require('http')
const Intl    = require('intl') // intl@1.2.5
const sqlite3 = require('sqlite3') // sqlite3@4.1.1
const PORT    = process.env.PORT || 8080

db = new sqlite3.Database('History') // this file can be found in \AppData\Local\Google\Chrome\User Data\Default\History

i = 0

tableau = []

function TimeToDate(x){

	var t = Math.trunc(x/1000)

	var e = Date.UTC(1601,0,1)
	var dt = new Date(e + t)

	var options = {

		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
	}

	var date = new Intl.DateTimeFormat('fr-FR', options);dtt=date.format(dt)

	return dtt

}

db.all("SELECT * FROM urls", (error, rows) => {

	max = rows.length

	for ( row of rows ){

		if( (/pokemon/).test(row.title)){

			tableau.push(row.title,TimeToDate(row.last_visit_time))
		}

		console.log(i+"/"+max)

		i++
	}
})

http.createServer(function (req, res) {

	if (req.url == '/'){

		res.writeHead(200,{'content-type':'text/plain;charset=utf8'})

		res.end(JSON.stringify(tableau,null,2))

	}
	  
}).listen(PORT)

console.log(`Running at port ${PORT}`)
