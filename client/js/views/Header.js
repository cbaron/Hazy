module.exports = Object.create( Object.assign( {}, require('./__proto__'), {

    Views: {
        typeAhead: { }
    },

    data: [
        'shop',
        'courses',
        'events'
    ],

    disableTypeAhead() {
        if( !this.views.typeAhead ) return Promise.resolve()

        this.views.typeAhead.removeAllListeners( 'itemSelected' ) 
        this.els.container.classList.remove( 'has-typeahead' )
       
        return this.views.typeAhead.delete()
        .then( () => delete this.views.typeAhead )
        .catch( this.Error )
    },

    enableTypeAhead( meta, method ) {
        ( this.views.typeAhead ? this.disableTypeAhead() : Promise.resolve() )
        .then( () => {
            this.Views.typeAhead = meta
            this.slurpTemplate( { template: `<div data-view="typeAhead"></div>`, insertion: { el: this.els.typeAhead } } )
            this.renderSubviews()
            this.els.container.classList.add( 'has-typeahead' )
            this.views.typeAhead.on( 'itemSelected', item => method( item ) )
        } )
    },

    events: {
        logo: 'click',
        logout: 'click',
        shopBtn: 'click',
        shoppingCart: 'click'
    },

    insertion() { return { el: document.querySelector('#content'), method: 'insertBefore' } },

    name: 'Header',

    onLogoClick() { this.emit( 'navigate', '/' ) },

    onLogoutClick() {
        this.user.logout()
    },

    onShopBtnClick() { this.emit( 'navigate', '/shop' ) },

    onShoppingCartClick() { this.emit( 'navigate', '/shop/cart') },

    onUserLogin() {
        this.els.profileBtn.classList.remove('hidden')        
        this.els.name.textContent = this.user.data.name || this.user.data.email
    },

    onUserLogout() {
        this.els.profileBtn.classList.add('hidden')        
        this.els.name.textContent = ''
    },

    postRender() {
        if( this.user.isLoggedIn() ) this.onUserLogin()

        this.updateCartCount()

        this.user.on( 'got', () => {
            console.log( 'header got' )
            if( this.user.isLoggedIn() ) this.onUserLogin()
            this.updateCartCount()
        } )

        this.user.on( 'logout', () => this.onUserLogout() )

        this.user.on( 'addToCart', () => this.updateCartCount() )
        this.user.on( 'deleteFromCart', () => this.updateCartCount() )

        return this
    },

    template: require('./templates/Header'),

    updateCartCount() {
        this.els.cartCount.textContent = this.user.git('cart') ? `(${this.user.data.cart.length})` : '(0)'
    },

    user: require('../models/User')

} ), { } )
