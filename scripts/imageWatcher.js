#!/usr/bin/env node

require('node-env-file')( `${__dirname}/../.env` )

Object.create( Object.assign( {}, require('../lib/MyObject'), require('../lib/Socket'), {

    Fs: require('fs'),
    GoogleCloudStorage: require('../lib/GoogleCloudStorage'),
    Postgres: require('../dal/Postgres'),
    Readline: require('readline'),
    Watch: require('watch'),
    WebSocket: require('ws'),

    directory: process.argv[3],
    email: process.argv[2],

    constructor() {
        this.socketOpen = false;
        this.state = 'waiting'

        this.interface = this.Readline.createInterface( {
            input: process.stdin,
            output: process.stdout
        } )
        
        this.Postgres.select( 'person', { email: this.email } )
        .then( persons => {

            if( persons.length !== 1 ) throw new Error('Person not found.  Goodbye.')

            this.userId = persons[0].id

            this.initSocket()
                .watchDirectory()

            return Promise.resolve()
        } )
        .catch( e => { this.Error(e); process.exit(1) } )
        
    },

    error( data ) {
        console.log(`Error creating disc.  Retry Y/n?`)

        
         this.interface.question( `Error creating disc.  Retry Y/n?`, answer => {
             if( answer.charAt(0).toLowerCase() === 'n' ) return process.exit(0)

             this.send( this.socket, { type: 'imagesUploaded', userId: this.userId, uris: this.uris } )
         } )
    },

    greatJob( data ) {
        console.log('Disc Created: ------> Great Job')
        this.state = 'waiting'

        Promise.all( Object.keys( this.newFiles ).map( filename => this.P( this.Fs.unlink, [ filename ], this.Fs ) ) )
        .then( () => {
            this.newFiles = { }
            this.uris = { }
            return Promise.resolve()
        } )
        .catch( this.Error )

    },

    initSocket() {
        this.socket = new this.WebSocket(`ws://${process.env.DOMAIN}:${process.env.WEBSOCKET_PORT}`)
         
        this.socket.on( 'open', () => { this.socketOpen = true; } )
         
        this.socket.on( 'message', this.onMessage.bind(this) )
            
        return this
    },

    proceedWithUpload( data ) {
        console.log(this.state)
        if( data.userId === this.userId && this.state === 'waiting' ) {
            this.state = 'uploading'
            console.log('uploading')
            Promise.all( Object.keys( this.newFiles ).map( ( filename, i ) =>
                this.GoogleCloudStorage.POST( `${data.discName}-${i}`, this.Fs.createReadStream( filename ) )
                .then( () => Promise.resolve( this.GoogleCloudStorage.getUri( `${data.discName}-${i}` ) ) )
            ) )
            .then( uris => {
                console.log('doneuploading');
                this.uris = uris
                this.send( this.socket, { type: 'imagesUploaded', userId: this.userId, uris } )
                return Promise.resolve()
            } )
            .catch( this.Error )
        }
    },

    watchDirectory() {
        this.newFiles = { }

        this.Watch.watchTree(
            this.directory,
            { ignoreDotFiles: true, ignoreNotPermitted: true, ignoreUnreadableDir: true, interval: 5 },
            ( f, curr, prev ) => {
                if( typeof f !== 'object' && prev === null && this.state !== 'uploading' ) {
                    this.newFiles[ f ] = true;
                    if( this.socketOpen && this.state === 'waiting' ) {
                        this.state = 'notifying'
                        console.log('sending create disc');
                        this.socket.send( JSON.stringify( { type: 'createDisc', userId: this.userId } ) )
                        this.state = 'waiting'
                    }
                }
            }
        )
    }

} ), { } ).constructor()
