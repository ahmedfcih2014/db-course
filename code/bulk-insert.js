const crypto = require('crypto')
const axios = require('axios')

const urls = []
for(let i = 0; i < 100; i++)
    urls.push(`https://facebook.com/${crypto.createHash('sha256').update('url-'+i).digest('base64').substr(0,8)}`)

const insertUrl = u => {
    axios
    .post(`http://localhost:8081?url=${u}`)
    .then(r => console.log(r?.data))
    .catch(err => console.log({...err}?.response?.data?.message))
    
    // fetch(``, {"method": "POST"})
    // .then(a => a.json())
    // .then(d => console.log(d))
    // .catch(e => console.log(e))
}

urls.forEach(insertUrl)
