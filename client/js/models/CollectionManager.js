module.exports = Object.create( Object.assign( { }, require('./__proto__'), {

    data: {
        currentCollection: 'DiscType',
        currentView: ''
    },

    meta: {
        DeviceLog: {
            add: false,
            displayBy: 'createdAt'
        }
        GiftCardTransaction: {
            add: false,
            payment: { hide: true }
        },
        StoreTransaction: {
            add: false,
            payment: { hide: true }
        }
    }

} ) )
