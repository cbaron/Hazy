require('node-env-file')( __dirname + '/.env' )

const Router = require('./router'),
    httpPort = process.env.HTTP_PORT

module.exports = Router.initialize()
.then( () => {

    require('http').createServer( Router.handler.bind(Router) ).listen( httpPort )

    console.log( `HTTP server listening at ${httpPort}` )

    require('./socketApp')
    console.log( `WebSocket server listening at ${process.env.WEBSOCKET_PORT}` )

    return Promise.resolve()
} )
.catch( e => console.log( `Error initializing app: ${e.stack ||e}` ) )
