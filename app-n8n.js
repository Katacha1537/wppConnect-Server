const wppconnect = require('@wppconnect-team/wppconnect')
const { response } = require('express')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const port = 8000
const request = require('request')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

wppconnect.create({
    session: "sessionKatacha",
    statusFind: (statusSession, session) => {
        console.log('Status Session: ', statusSession)
        console.log('Session name: ', session)
    },
    headless: true,
    puppeteerOptions: {
        userDataDir: 'tokens/SessionName'
    },
})
.then((client) => start(client))
.then((error) => console.log(error))

async function start(client){
    console.log('BOT KATACHA - INICIANDO BOT')

    //escuta mensagem
    client.onMessage(async (msg)=>{
        try{
            const options = {
                'method': 'POST',
                'url': 'https://deliriumfast.up.railway.app/webhook-test/call',
                'headers': {
                    'Content-Type': 'application/json'
                },
                json: msg
            }
            request(options, function (error, response){
                if(error){
                    throw new Error(error)
                } else{
                    console.log(response.body)
                }
            })
        } catch (e) {
            console.log(e)
        }
    })

    //envia mensagem
    app.post('/send-message', async (req, res) => {
        const number = req.body.number
        const message = req.body.message
        client.sendText(number, message).then(response => {
            res.status(200).json({
                status: true,
                message: 'BotKatacha Mensagem Enviada',
                response: response
            })
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: 'BotKatacha Mensagem não Enviada',
                response: err.text
            })
        })
    })
}

server.listen(port, function(){
    console.log('BotKatacha rodando na porta: '+port)
})