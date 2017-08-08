module.exports = Object.assign( {}, require('./__proto__'), {

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
        logout: 'click'
    },

    onLogoClick() { this.emit( 'navigate', '/' ) },

    onLogoutClick() {
        this.user.logout()
    },

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

        this.user.on( 'got', () => { if( this.user.isLoggedIn() ) this.onUserLogin() } )
        this.user.on( 'logout', () => this.onUserLogout() )

        return this
    }

} )
