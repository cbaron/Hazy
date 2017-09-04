module.exports = Object.create( {

    Error: require('../../lib/MyError'),
    
    ViewFactory: require('./factory/View'),
    
    Views: require('./.ViewMap'),

    Dragger: require('./views/Dragger'),
    Toast: require('./views/Toast'),

    User: require('./models/User'),

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    initialize() {

        this.contentContainer = document.querySelector('#content')

        this.ViewFactory.constructor()

        this.Toast.constructor( { range: this.ViewFactory.range } )
        this.Dragger.constructor( { range: this.ViewFactory.range } )

        window.onpopstate = this.handle.bind(this)

        this.User.on( 'logout', () =>
            Promise.all( Object.keys( this.views ).map( view => this.views[ view ].delete() ) )
            .then( () => { this.currentView = undefined; return this.handle() } )
            .catch( this.Error )
        )
        
        this.header =
            this.ViewFactory.create( 'header', { insertion: { el: this.contentContainer, method: 'insertBefore' } } )
            .on( 'navigate', route => this.navigate( route ) )

        this.footer = this.ViewFactory.create( 'footer', { insertion: { el: document.body, method: 'appendChild' } } )

        this.handle()
    },

    handle() {
        this.handler( window.location.pathname.split('/').slice(1) )
    },

    handler( path ) {
        const name = this.pathToView( path[0] ),
            view = this.Views[ name ] ? name : 'home'

        this.header.disableTypeAhead()
        this.footer.els.container.classList.toggle( 'hidden', path[0] === 'admin' )

        if( view === this.currentView ) return this.views[ view ].onNavigation( path.slice(1) )

        this.scrollToTop()

        Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
        .then( () => {

            this.currentView = view

            if( this.views[ view ] ) return this.views[ view ].onNavigation( path )

            return Promise.resolve(
                this.views[ view ] =
                    this.ViewFactory.create( view, { insertion: { el: this.contentContainer }, path } )
                    .on( 'navigate', ( route, options ) => this.navigate( route, options ) )
                    .on( 'deleted', () => delete this.views[ view ] )
                    .on( 'enableHeaderTypeAhead', ( meta, method ) => this.header.enableTypeAhead( meta, method ) )
                    .on( 'disableHeaderTypeAhead', meta => this.header.disableTypeAhead() )
            )
        } )
        .catch( this.Error )
    },

    navigate( location, options={} ) {
        if( this.header.displayingTypeAhead ) this.header.removeTypeAhead()

        if( options.replace ) {
            let path = `${window.location.pathname}`.split('/')
            path.pop()
            path.push( location )
            location = path.join('/')
        }
        else if( options.append ) { location = `${window.location.pathname}/${location}` }

        if( location !== window.location.pathname ) history.pushState( {}, '', location )
        if( !options.silent ) this.handle()
    },

    pathToView( path ) {
        const hyphenSplit = path.split('-')
        return hyphenSplit.map( item => this.capitalizeFirstLetter( item ) ).join('')
    },

    scrollToTop() {
        window.scroll( { top: 0, left: 0, behavior: 'smooth' } )
    },

}, { currentView: { value: '', writable: true }, views: { value: { } } } )
