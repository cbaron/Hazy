module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Shop'),

    events: {
        categories: 'click'
    },

    insertCategories() {
        this.slurpTemplate( {
            insertion: { el: this.els.categories },
            template: this.Format.GetListItems( this.model.git('collections'), { dataAttr: 'name' } )
        } )
    },

    onCategoriesClick( e ) {
        if( e.target.tagName !== 'LI' ) return
        this.emit( 'navigate', `/shop/${e.target.getAttribute('data-name')}` )
    },

    onNavigation( path ) {
        this.path = path;

        if( this.model.git('collections').find( collection => collection.name === path[0] ) || path[0] === 'cart' ) return this.showView( path[0] )

        if( path[0] === 'checkout' ) {
            return this.views.cart.cartPromise
            .then( () => this.showView( 'checkout', { shoppingCart: this.views.cart.views.cartContents.collection.data } ) )
            .catch( this.Error )
        }

        Promise.all( Object.keys( this.views ).map( key => {
            const view = this.views[ key ]
            return view ? view.hide() : Promise.resolve()
        } ) )
        .then( () => { this.currentEl = this.els.nav; return this.showEl( this.els.nav ) } )
        .catch( this.Error )
    },

    postRender() {
        this.insertCategories()

        this.currentEl = this.els.nav

        this.views.cart.on( 'navigate', ( route, opts ) => this.emit( 'navigate', route, opts ) )

        if( this.path.length > 1 ) this.onNavigation( this.path.slice(1) )

        return this
    },

    showView( name, data={} ) {
        return this.hideEl( this.currentEl )
        .then( () => {
            this.views[ name ]
                ? this.views[ name ].onNavigation( this.path.slice( 1 ), data )
                : this.views[ name ] = this.factory.create( name, Object.assign( { insertion: { el: this.els.views }, path: this.path.slice(1) }, data ) )
                    .on( 'navigate', ( route, opts ) => this.emit( 'navigate', route, opts ) )
        
            this.currentView = this.views[ name ]
            this.currentEl = this.views[ name ].getContainer()

            return Promise.resolve()
        } )
        .catch( this.Error )
    }

} )