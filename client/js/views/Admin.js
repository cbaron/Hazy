module.exports = Object.assign( { }, require('./__proto__'), {

    events: {
        collectionManager: 'click',
        manageByop: 'click',
    },

    model: {

        manageByop: { label: 'Manage Byop', roles: new Set( [ 'superuser' ] ), url: 'manage-byop' },

        collectionManager: {
            label: 'Collection Manager',
            roles: new Set( [ 'superuser' ] ),
            url: 'collection-manager'
        }
    },
    
    onHeaderTypeAheadSelection( item ) { this.currentView.onItemSelected( item ) },

    onManageDiscTypesClick() {
        this.emit( 'navigate', `manage-disc-types`, { append: true } )
    },

    onCollectionManagerClick() {
        this.emit( 'navigate', `collection-manager`, { append: true } )
    },

    onNavigation( path ) {
        this.path = path

        const key = this.keys.find( key => this.model[ key ].url === path[0] )

        if( key !== undefined ) return this.showView( key )

        Promise.all( Object.keys( this.model ).map( key => {
            const view = this.model[ key ].view
            return view ? view.hide() : Promise.resolve()
        } ) )
        .then( () => { this.currentEl = this.els.splash; return this.showEl( this.els.splash ) } )
        .catch( this.Error )
    },

    postRender() {
        this.keys = Object.keys( this.model )

        this.keys.forEach( ( name, i ) => {
            if( this.user.data.roles.filter( role => this.model[ name ].roles.has( role ) ).length ) {
                this.slurpTemplate( { template: `<button data-js="${name}">${this.model[ name ].label}</button>`, insertion: { el: this.els[ `column${ i % 2 }` ] } } )
            }
        } )

        this.currentEl = this.els.splash

        if( this.path.length > 1 ) this.onNavigation( this.path.slice( 1 ) )

        return this
    },

    requiresLogin: true,

    requiresRole: 'admin',

    showView( key ) {
        return this.hideEl( this.currentEl )
        .then( () => {
            this.model[ key ].view 
                ? this.model[ key ].view.onNavigation( this.path.slice( 1 ) )
                : this.model[ key ].view = this.factory.create( key, { insertion: { el: this.els.views }, path: this.path.slice(1) } )
                    .on( 'navigate', ( route, opts ) => this.emit( 'navigate', route, opts ) )
        
            this.currentView = this.model[ key ].view
            this.currentEl = this.model[ key ].view.getContainer()
            return Promise.resolve()
        } )
        .catch( this.Error )
    }
} )
