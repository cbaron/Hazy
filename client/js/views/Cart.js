module.exports = Object.assign( {}, require('./__proto__'), {

    Templates: {
        CartItem: require('./templates/CartItem')
    },

    Views: {
        cartContents() {
            return {
                events: { deleteBtn: 'click' },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Model ).constructor( [ ], { meta: { key: '_id' } } ),

                } ),
                itemTemplate: ( datum, format ) => this.Templates.CartItem( Object.assign( { datum, ImageSrc: format.ImageSrc, Currency: format.Currency } ) ),
                onDeleteBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    return this.user.deleteFromCart( listEl.getAttribute('data-key') )
                }
            }
        }
    },

    events: {
        checkoutBtn: 'click'
    },

    updateSubtotal() {
        /*const collection = this.views.cartContents.collection.data,
            subtotal = collection.reduce( ( memo, datum ) => {
                if( !datum.quantity ) datum.quantity = 1
                memo += ( window.parseFloat( datum.price ) * window.parseFloat( datum.quantity ) )
                return memo
            }, 0 )*/

        this.els.itemCount.textContent = `(${this.user.git('cart').length} items):`
        this.els.subtotal.textContent = this.Format.Currency.format( this.user.meta.subtotal )
    },

    fkNames: [ 'DiscClass', 'DiscType' ],

    onCheckoutBtnClick() {
        this.emit( 'navigate', 'checkout' )
    },

    onNavigation() {
        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => this.els.container.scrollIntoView( { behavior: 'smooth' } ) )
        .catch( this.Error )
    },

    postRender() {
        this.cartPromise = new Promise( resolve => this.resolver = resolve )

        this.DiscClass = Object.create( this.Model ).constructor( {}, { resource: 'DiscClass' } )
        this.Disc = Object.create( this.Model ).constructor( {}, { resource: 'Disc' } )

        this.DiscClass.get()
        .then( () => this.retrieveCart() )
        .then( () => {
            this.updateSubtotal()
            this.resolver()
        } )
        .catch( this.Error )

        this.user.on( 'addToCart', item => {
            const existingCartDatum = this.views.cartContents.collection.data.find( datum => datum._id === item._id )

            if( existingCartDatum ) {
                return this.Toast.createMessage( 'error', 'Item already in shopping cart.' )
                //cartDatum.quantity = window.parseFloat( cartDatum.quantity ) + window.parseFloat( item.quantity )
                //this.views.cartContents.update( this.views.cartContents.collection.data )
            } else this.views.cartContents.add( item )

            this.updateSubtotal()
        } )

        this.user.on( 'deleteFromCart', id => {
            const cartDatum = this.views.cartContents.collection.data.find( datum => datum._id === id )
            this.views.cartContents.remove( cartDatum )
            this.updateSubtotal()
        } )

        this.user.on( 'cartReset', () => {
            this.views.cartContents.collection.data = [ ]
            this.views.cartContents.empty()
            this.updateSubtotal()
        } )

        return this
    },

    retrieveCart() {
        if( !this.user.git('cart') || !this.user.git('cart').length ) return Promise.resolve( this.user.set( 'cart', [ ] ) )

        this.user.calculateSubtotal()

        return Promise.all( this.user.git('cart').map( cartDatum => {
            if( !this[ cartDatum.collectionName ] ) this[ cartDatum.collectionName ] = Object.create( this.Model ).constructor( {}, { resource: cartDatum.collectionName } )
            
            const model = this[ cartDatum.collectionName ]

            return model.get( { id: cartDatum.id } )
            .then( response => {
                const keys = Object.keys( response )
                if( !keys.length ) return Promise.resolve()

                return Promise.all( keys.map( key => {
                    if( !this.fkNames.includes( key ) ) return Promise.resolve()

                    return this.Xhr( { resource: key, id: response[ key ] } )
                    .then( fkDatum => response[ key ] = fkDatum.label )
                    .catch( this.Error )
                } ) )
                .then( () => {
                    response.collectionName = cartDatum.collectionName
                    response.quantity = cartDatum.quantity
                    return Promise.resolve( this.views.cartContents.add( response ) )
                } )
                .catch( this.Error )
            } )
            .catch( this.Error )
        } ) )
    }

} )