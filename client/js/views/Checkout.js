module.exports = Object.assign( {}, require('./__proto__'), {

    Templates: {
        Disc: require('./templates/Disc')
    },

    Views: {
        cartContents() {
            return {
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Model ).constructor( [ ], { meta: { key: '_id' } } ),
                } ),
                itemTemplate: ( datum, format ) => this.Templates.Disc( Object.assign( { datum, ImageSrc: format.ImageSrc, Currency: format.Currency } ) )
            }
        },

        storeTransaction() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/StoreTransaction').attributes,
                    data: { total: 0 },
                    meta: { noLabel: true },
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
        const total = this.shoppingCart.reduce( ( memo, item ) => memo + item.price, 0 )
        this.views.storeTransaction.model.set( 'total', total )
    },

    onNavigation( path, data ) {
        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => this.update( data.shoppingCart ) )
        .catch( this.Error )
    },

    postRender() {
        this.views.storeTransaction.views.shipping.els.name.value = 'Scott Parton'
        this.views.storeTransaction.views.shipping.els.street.value = '1327 Sumac Dr'
        this.views.storeTransaction.views.shipping.els.cityStateZip.value = 'Knoxville, TN 37919'
        this.views.storeTransaction.views.shipping.els.email.value = 'saparton@gmail.com'
        this.views.storeTransaction.views.shipping.els.phone.value = '7737938718'

        this.views.storeTransaction.views.payment.els.ccName.value = 'Scott Parton'
        this.views.storeTransaction.views.payment.els.ccNo.value = '4242424242424242'
        this.views.storeTransaction.views.payment.els.ccMonth.value = '10'
        this.views.storeTransaction.views.payment.els.ccYear.value = '2020'
        this.views.storeTransaction.views.payment.els.cvc.value = '666'

        this.views.storeTransaction.model.on( 'totalChanged', () =>
            this.views.storeTransaction.els.total.textContent = this.Format.Currency.format( this.views.storeTransaction.model.git('total') )
        )

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