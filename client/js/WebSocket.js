module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), require('events').EventEmitter.prototype, {

    constructor() {
       this.socket = new WebSocket(`ws://${window.location.hostname}:1340` );

        this.socket.onopen = event => {
            this.isOpen = true
        }

        this.socket.onmessage = event => {
		    if( this.user.id === event.data.userId ) this.emit( event.data.type, event.data )
		}

       return this
    },

    user: require('./models/User'),

} ), { } ).constructor()
