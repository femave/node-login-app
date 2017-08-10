const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const session = require('express-session')
const cookieSession = require('cookie-session')
const fs = require('fs')
const app = express()

app.set('view engine', 'pug')

app.use( express.static( path.join(__dirname,'public')) )
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// -------> start middleware <------------

app.use(cookieSession({
  name: 'cookieEatCookies',
  keys: ['palabraClaveSuperSecretaNUmber1', 'YEstaEsOTRApalabraSuperSecret'],
  maxAge: 24 * 60 * 60 * 1000
}))

app.use( function(req, res, next) {
	let log = req.session.loggin
  log = log || {}
  next()
})

// -------> end middleware <------------


// -------> start app methods <------------

app.get('/', (req,res) => {
	console.log(req.session.loggin)
	req.session.loggin !== undefined ? res.redirect('/home') : res.render('pages/login') 
})

app.get('/home', (req,res) => {
	req.session.loggin === undefined ? res.redirect('/') : res.render('pages/home', {user:req.session.loggin}) 
})

app.get('/error', (req,res) => {
	res.render('pages/error')
})

app.get('/register', (req, res) => {
	res.render('pages/register')
})

app.post('/register-user',(req, res) => {
	fs.readFile('./data/data.txt','utf8', function read(err, data){
		if (err) throw err;
    let content = data.split('\r\n')
    const email = req.body.email
		const password = req.body.password
		let emailPas = '\r\n' + email + ':' + password
		
    let match = content.some(function(item){
    	let [emailDB, passwordDB] = item.split(':')
    	return emailDB === email
    })
    
    if(match === false){
    	fs.appendFileSync('./data/data.txt', emailPas);
    	res.redirect('/')
    }else{
    	res.redirect('/register');    	
    }
	})
})

app.post('/log-in', (req,res)=>{
	fs.readFile('./data/data.txt','utf8', function read(err, data) {
    if (err) throw err;
    let content = data.split('\r\n')
    const email = req.body.email
		const password = req.body.password
		
    let match = content.some(function(item){
    	let [emailDB, passwordDB] = item.split(':')
    	let userLog = emailDB === email && passwordDB === password
    	return userLog
    })
    console.log(content)
    
    if(match === true){
    	req.session.loggin = {emailDB:email, passwordDB:password}
    	res.redirect('/home')
    }else{
    	res.redirect('/error')
    }
	});
})

app.delete('/log-out', (req,res) => {
	delete req.session.loggin 
	res.render('pages/login')
})

// -------> end app methods <------------


app.listen(3000)