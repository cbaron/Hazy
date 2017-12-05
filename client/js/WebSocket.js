module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), require('events').EventEmitter.prototype, {

    constructor() {
       this.socket = new WebSocket(`ws://${window.location.hostname}:1342` );

        this.socket.onopen = event => {
            this.isOpen = true
        }

        this.socket.onmessage = event => {
            let data = event.data;

            try { data = JSON.parse( data ) } catch( e ) { console.log( data, e ); return }

		    if( this.user.git('id') === data.userId ) this.emit( data.type, data )
		}

       return this
    },

    send( data ) { this.socket.send( JSON.stringify( data ) ) },

    user: require('./models/User'),

} ), { } ).constructor()
