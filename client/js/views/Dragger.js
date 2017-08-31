module.exports = Object.create( Object.assign( {}, require('./__proto__'), {

    Icons: {
        error: require('./templates/lib/error')(),
        success: require('./templates/lib/checkmark')()
    },
    
    bindEvents() {
        document.body.addEventListener( 'mousedown', this.onMouseDown )
        document.body.addEventListener( 'mouseup', this.onMouseUp )
        document.body.addEventListener( 'mousemove', this.onMouseMove )
    },

    listen() {
        this.listeners++

        if( this.listeners === 1 ) this.bindEvents()
    },

    name: 'Dragger',

    postRender() {
        this.listeners = 0

        this.onMouseDown = e => this.emit('mousedown', e)
        this.onMouseUp = e => this.emit('mouseup', e)
        this.onMouseMove = e => this.emit('mousemove', e)

        return this
    },

    stopListening() {
        this.listeners--

        if( this.listeners === 0 ) this.unbindEvents()
    },

    template: require('./templates/Dragger'),

    unbindEvents() {
        document.body.removeEventListener( 'mousedown', this.onMouseDown )
        document.body.removeEventListener( 'mouseup', this.onMouseUp )
        document.body.removeEventListener( 'mousemove', this.onMouseMove )
    }

} ), { } )
