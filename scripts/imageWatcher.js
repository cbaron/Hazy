#!/usr/bin/env node

require('node-env-file')( `${__dirname}/../.env` )

Object.create( Object.assign( {}, require('../lib/MyObject'), {

	Fs: require('fs'),
	Postgres: require('../dal/Postgres'),
    Watch: require('watch'),
    WebSocket: require('ws'),

    directory: process.argv[3],
    email: process.argv[2],

	constructor() {
        
        return Promise.resolve( ( async () => { 
            const person = await this.Postgres.select( 'person', { email: this.email } )

            if( person.length !== 1 ) throw new Error('Person not found.  Goodbye.')

            this.userId = person[0].id

            this.initSocket()
                .watchDirectory()
        } )() )
        
    },

    initSocket() {
        this.socket = new this.WebSocket(`ws://${process.env.DOMAIN}:${process.env.WEBSOCKET_PORT}`)
         
        this.socket.on( 'open', () => { console.log('Connected to socket: Great Job!'); this.socketOpen = true; } )
         
        this.socket.on( 'message', data => {
          console.log(data);
        } )

        return this
    },

    watchDirectory() {
        console.log( this.directory );
        this.Watch.watchTree(
            this.directory,
            { ignoreDotFiles: true, ignoreNotPermitted: true, ignoreUnreadableDir: true, interval: 5 },
            ( f, curr, prev ) => {
                if (typeof f == "object" && prev === null && curr === null) {
                    if( this.socketOpen ) this.socket.send( JSON.stringify( { type: 'createDiscs', userId: this.userId } ) )
                }
            }
        )
    }

} ), { } ).constructor().catch( e => { this.Error(e); process.exit(1) } )
