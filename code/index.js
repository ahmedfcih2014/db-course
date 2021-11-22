const app = require('express')()
const {Client} = require('pg')
const crypto = require('crypto')
const ConsistentHash = require('consistent-hash')
const hashRing = new ConsistentHash()
hashRing.add('5432')
hashRing.add('5433')
hashRing.add('5434')

const clients = {
    '5432': new Client({
        "host": "172.17.0.1",
        "port": "5432",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    '5433': new Client({
        "host": "172.17.0.1",
        "port": "5433",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    '5434': new Client({
        "host": "172.17.0.1",
        "port": "5434",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    })
}

const connect = async () => {
    await clients['5432'].connect()
    await clients['5433'].connect()
    await clients['5434'].connect()
}

connect()

app.get('/' ,(req ,res) => {

})

app.post('/' ,async (req ,res) => {
    const url = req.query.url
    const hash = crypto.createHash('sha256').update(url).digest('base64')
    const urlId = hash.substr(0 ,5)
    const server = hashRing.get(urlId)

    await clients[server].query("INSERT INTO urls (url ,url_id) VALUES ($1 ,$2)" ,[url ,urlId])

    res.send({
        "hash": hash,
        "urlId": urlId,
        "server": server
    })
})

app.listen(8081 ,() => console.log('server running at http://localhost:8081'))