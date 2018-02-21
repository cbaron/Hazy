module.exports = Object.create( Object.assign( { }, require('./__proto__'), {

    data: {
        currentCollection: 'DiscType',
        currentView: ''
    },

    meta: {
        DeviceLog: {
            add: false,
            displayAttr: 'createdAt',
            sort: { createdAt: -1 },
            templateOptions: { hideButtonRow: true }
        },
        Disc: {
            displayAttr: 'DiscDocument',
            validate: {
                DiscType: val => val !== undefined,
                cost: val => val !== '',
                price: val => val !== ''
            }
        },
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
