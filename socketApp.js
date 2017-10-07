module.exports = Object.create( Object.assign( { }, require('./lib/MyObject'), require('./lib/Socket'), {

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
          
          client.on( 'message', data => this.onMessage( data, client ) )

        } )
    },

    createDisc( parsedData, data, clientSocket ) {
        this.patchClient( parsedData.userId, { watcherSocket: clientSocket, state: 'creatingDisc' } )
        this.broadcast( data )
    },

    greatJob( parsedData, data, clientSocket ) {
        if( this.Clients[ parsedData.userId ] && this.Clients[ parsedData.userId ].state === 'waitingForPost' ) {
           this.patchClient( parsedData.userId, { adminSocket: clientSocket, state: 'greatJob' } )
           this.Clients[ parsedData.userId ].watcherSocket.send( data );
       }
    },

    imagesUploaded( parsedData, data, clientSocket ) {
        console.log('images uploaded')
        if( this.Clients[ parsedData.userId ] && this.Clients[ parsedData.userId ].state === 'waitingForUpload' ) {
            console.log('waiting for post')
            this.patchClient( parsedData.userId, { state: 'waitingForPost' } )
            this.Clients[ parsedData.userId ].adminSocket.send( data );
        }
    },

    patchClient( id, obj ) {
        if( this.Clients[ id ] === undefined ) this.Clients[ id ] = { }
        Object.assign( this.Clients[ id ], obj )
        return this
    },

    proceedWithUpload( parsedData, data, clientSocket ) {
       if( this.Clients[ parsedData.userId ] && this.Clients[ parsedData.userId ].state === 'creatingDisc' ) {
           this.patchClient( parsedData.userId, { adminSocket: clientSocket, state: 'waitingForUpload' } )
           this.Clients[ parsedData.userId ].watcherSocket.send( data );
       }
    }

} ), {} ).constructor()
