#!/usr/bin/env node

require('node-env-file')( `${__dirname}/../.env` )

const QueryString = require('querystring')

const lineReader = require('readline').createInterface( {
  input: require('fs').createReadStream( `${__dirname}/../bootstrap/omnispearBullshit.lol` )
} ),
    Error = require('../lib/MyError'),
    Mongo = require('../dal/Mongo')

const data = { }

let currentDisc = { }

lineReader.on( 'line', line => {
    if( line.length < 2 || line.indexOf( `<br />` ) !== -1 || /^[0-9]/.test(line) ) return

    if( /^\w+\s.*\t\w/.test( line ) ) {
        if( currentDisc.label ) {
            data[ QueryString.unescape( currentDisc.label ).replace(/\s/g,'-').toLowerCase() ] = JSON.parse( JSON.stringify( currentDisc ) )
        }
            
        currentDisc =  { }

        let [ label, ...description ] = line.split('\t')
        Object.assign( currentDisc, { label, description: description.join(' ') } )
    } else {
        const result = /<div class="chartGreen">(-?[0-9]+)<\/div><div class="chartRed">(-?[0-9]+)<\/div><div class="chartBlue">(-?[0-9]+)<\/div><div class="chartYellow">(-?[0-9]+)<\/div>/.exec(line)
        if( result !== null ) {
            Object.assign( currentDisc, { speed: result[1], glide: result[2], turn: result[3], fade: result[4] } )
            data[ QueryString.unescape( currentDisc.label ).replace(/\s/g,'-').toLowerCase() ] = JSON.parse( JSON.stringify( currentDisc ) )
        } else {
            const anotherResult = /.*alt="Disc Flight Path">(.*)/i.exec( line )
            if( anotherResult === null ) {
                currentDisc.description = `${currentDisc.description} ${line}`
            } else {
                currentDisc.description = `${currentDisc.description} ${anotherResult[1]}`
            }
        }
    }
} )

lineReader.on( 'close', () => {
    Mongo.getDb()
    .then( db => 
        Promise.all( Object.keys( data ).map( key => 
            db.collection('DiscType').insertOne( Object.assign( { name: key }, data[key] ) )
        ) )
        .catch( e => Promise.resolve( Error(e) ) )
        .then( () => db.close() )
    )
    .then( () => process.exit(0) )
} )
