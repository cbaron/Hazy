module.exports = Object.assign( {}, require('./__proto__'), {

    Templates: {
        DiscType: require('./templates/DiscType')
    },

    Views: {
        cartContents() {
            return {
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Model ).constructor( [ ], { meta: { key: '_id' } } ),
                } ),
                itemTemplate: ( datum, format ) => this.Templates.DiscType( Object.assign( { datum, ImageSrc: format.ImageSrc, Currency: format.Currency } ) )
            }
        },

        storeTransaction() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/StoreTransaction').attributes,
                    data: { total: 0 },
                    meta: {
                        noLabel: true,
                        isSold: { hide: true }
                    },
                    resource: 'StoreTransaction'
                } ),
                templateOptions() {
                    return {
                        displayTotal: true
                    }
                },
                toastSuccess: 'Thank you for your purchase! You will receive an email confirmation shortly.'
            }
        }

    },

    events: {
        views: {
            storeTransaction: [
                [ 'posted', function() {
                    return this.reset()
                    .then( () => this.emit( 'navigate', '/' ) )
                    .catch( this.Error )
                } ]
            ]
        }
    },

    calclulateTotal() {
        const total = this.views.storeTransaction.model.git( 'shoppingCart' ).reduce( ( memo, item ) => {
            if( item.price ) memo += window.parseFloat( item.price )
            return memo
        }, 0 )

        this.views.storeTransaction.model.set( 'total', total )
    },

    onNavigation( path, data ) {
        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => this.els.container.scrollIntoView( { behavior: 'smooth' } ) )
        .then( () => this.update( data.shoppingCart ) )
        .catch( this.Error )
    },

    postRender() {
        this.views.storeTransaction.model.on( 'totalChanged', () =>
            this.views.storeTransaction.els.total.textContent = this.Format.Currency.format( this.views.storeTransaction.model.git('total') )
        )

        this.views.storeTransaction.on( 'error', err => {
            if( err.item ) {
                this.user.deleteFromCart( err.item._id )
                this.emit( 'navigate', '/shop/cart' )
            }
        } )

        this.update( this.shoppingCart )

        return this
    },

    reset() {
        this.views.storeTransaction.clear()
        this.views.storeTransaction.data = { }
        this.views.storeTransaction.model.set( 'total', 0 )

        return this.user.resetCart()
        .then( () => Promise.resolve( this.els.container.scrollIntoView( { behavior: 'smooth' } ) ) )
    },

    update( cartData ) {
        this.views.storeTransaction.model.set( 'shoppingCart', cartData )
        this.views.cartContents.update( cartData )
        this.calclulateTotal()
    }

} )