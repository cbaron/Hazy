module.exports = Object.create( Object.assign( {}, require('../../../client/js/views/__proto__'), {

    ToastMessage: require('./ToastMessage'),

    name: 'Toast',

    postRender() {
        this.messages = { }

        return this
    },

    requiresLogin: false,

    createMessage( type, message ) {
        if( !this.messages[ message ] ) this.messages[ message ] = this.factory.create( 'ToastMessage', { insertion: { el: this.els.container } } )

        return this.messages[ message ].showMessage( type, message )

    },

    template: require('./templates/Toast')

} ), { } )
