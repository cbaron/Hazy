#!/usr/bin/env node

require('node-env-file')( `${__dirname}/../.env` )

Object.create( Object.assign( {}, require('./lib/MyObject'), {

	Fs: require('fs')
	Postgres: require('./dal/Postgres'),
    Watch: require('watch'),
    WebSocket: require('ws'),

    directory: process.argv[3],
    email: process.argv[2]

	async constructor() {
        
        const person = await this.Postgres.select( 'person', { email: this.email } )

        if( person.length !== 1 ) throw new Error('Person not found.  Goodbye.')

        this.userId = person[0].id

        this.initSocket()
            .watchDirectory()
        
    },

    initSocket() {
        this.socket = new this.WebSocket(`ws://${process.env.DOMAIN}:${process.env.WEBSOCKET_PORT}`)
         
        this.socket.on( 'open', () => { console.log('GreatJob') } )
         
        this.socket.on( 'message', data => {
          console.log(data);
        } )

        return this
    },

    watchDirectory() {
        Watch.watchTree(
            this.directory,
            { ignoreDotFiles: true, ignoreNotPermitted: true, ignoreUnreadableDir: true, interval: 5 },
            ( f, curr, prev ) => {
                if (typeof f == "object" && prev === null && curr === null) {
                    this.socket.send( JSON.stringify( { type: 'createDiscs', userId: this.userId } ) )
                }
            }
        )
    }

} ), { } ).constructor().catch( this.Error ).then( () => process.exit(0) )
