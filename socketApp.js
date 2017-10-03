module.exports = Object.create( Object.assign( { }, require('./lib/MyObject'), {

    Clients: { },
    
    Postgres: require('./dal/Postgres'),

    WebSocket: require('ws'),

    broadcast( data ) {
        this.server.clients.forEach( client => {
            if( client.readyState === this.WebSocket.OPEN ) client.send(data)
        } )
    },

    constructor() {
        this.server = new this.WebSocket.Server( { port: process.env.WEBSOCKET_PORT } )

        this.server.on( 'connection', client => {

          client.on( 'message', data => {
              let parsedData = undefined;

              try { parsedData = JSON.parse( data ) } catch( e ) { console.log( data, e ); return }

              if( parsedData.type === 'createDisc' ) {
                  this.Clients[ parsedData.userId ] = { state: 'creatingDisc' }
                  this.broadcast( data )
              }
          } )
        } )
    }
} ), {} ).constructor()
