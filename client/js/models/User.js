module.exports = Object.create( Object.assign( {}, require('./__proto__.js'), {

    addToCart( item ) {
        if( !this.git('cart') ) this.data.cart = [ ]
        
        const itemAlreadyInCart = this.data.cart.find( datum => datum.id === item._id )

        if( itemAlreadyInCart ) {
            //item.quantity = window.parseFloat( item.quantity ) + window.parseFloat( itemAlreadyInCart.quantity )
        } else this.data.cart.push( {
            id: item._id,
            quantity: item.quantity || 1,
            price: item.price || 0,
            collectionName: item.collectionName || 'Disc'
        } )

        this.set( 'cart', this.data.cart )
        this.calculateSubtotal()

        this.emit( 'addToCart', item )
        return this.setCookie()
    },

    calculateSubtotal() {
        this.meta.subtotal = this.git('cart').reduce( ( memo, datum ) => {
            memo += ( window.parseFloat( datum.price ) * window.parseFloat( datum.quantity ) )
            return memo
        }, 0 )
    },

    deleteFromCart( id ) {
        const index = this.data.cart.findIndex( datum => datum.id === id )
        this.data.cart.splice( index, 1 )

        this.set( 'cart', this.data.cart )
        this.calculateSubtotal()

        this.emit( 'deleteFromCart', id )
        return this.setCookie()        
    },

    isLoggedIn() {
        return Boolean( this.data && this.data.id )  
    },

    logout() {
        document.cookie = `hzy=; domain=${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`

        this.data = { }
        this.emit('logout')
    },

    resetCart() {
        this.set( 'cart', [ ] )
        this.meta.subtotal = 0
        this.emit('cartReset')
        return this.setCookie()
    },

    setCookie() {
        return this.Xhr( { method: 'post', resource: 'cart-item', data: JSON.stringify( this.data ) } )
        .catch( this.Error )
    }

} ), { resource: { value: 'me' } } )
