const express = require('express')
const app = express()
const { db, Cable, Series } = require('./db')

app.get('/', (req, res) => res.redirect('/networks'))

app.get('/networks', async (req, res, next) => {
    try {
        const networks = await Cable.findAll({ include: [ Series ]})
        const html = networks.map( network => {
            return `
                <div> ${network.name} <a href='/series/${network.id}'>Series>></a></div>
            `
        }).join('')
        res.send(`
            <html>
            <head><title> Cable Network Channels </title></head>
            <body>
                ${html}
            </body>
            </html>
            `)
    }
    catch(ex){
        next(ex)
    }
})

app.get('/series/:seriesId', async (req, res, next) => {
    try{
    const tvSeries = await Series.findAll( {where: {cableId: req.params.seriesId}} )
    console.log(tvSeries)
    const html = tvSeries.map(tv => {
                return `
                <div> ${tv.name}</div>
                `
    }).join('')
    res.send(`<html>
              <body>
                <p>
                <a href='/'> >>Back </a>
                ${html}
                </p>
              </body>
            </html>`)
    }
    catch(ex){
        next(ex)
    }
})
const init = async (req, res, next) => {
    try {
        console.log('Connection to database...')
        await db.sync( {force: true})
        const abc = await Cable.create({name: 'ABC'})
        const nbc = await Cable.create({name: 'NBC'})
        const fox = await Cable.create({name: 'FOX'})
        const cbs = await Cable.create({name: 'CBS'})
        await Series.create({name: 'WheelOfFortune', cableId: abc.id})
        await Series.create({name:'TheEllenShow', cableId: nbc.id})
        await Series.create({name: 'TheTalk', cableId: cbs.id})
        await Series.create({name: 'TheMaskedSinger', cableId: fox.id})

    }
    catch(ex){
        next(ex)
    }
}

init()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Listening on Port ', PORT))