module.exports = Object.create( Object.assign( { }, require('./__proto__'), {

    data: {
        currentCollection: 'DiscType',
        currentView: ''
    },

    meta: {
        GiftCardTransaction: {
            add: false,
            payment: { hide: true }
        }
    }

} ) )
