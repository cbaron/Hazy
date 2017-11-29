module.exports = Object.assign( { }, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    $( el, selector ) { return Array.from( el.querySelectorAll( selector ) ) },

    Format: require('../Format'),

    Model: require('../models/__proto__'),

    OptimizedResize: require('./lib/OptimizedResize'),
    
    Xhr: require('../Xhr'),

    bindEvent( key, event, el ) {
        const els = el ? [ el ] : Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ],
           name = this.getEventMethodName( key, event )

        if( !this[ `_${name}` ] ) this[ `_${name}` ] = e => this[ name ](e)

        els.forEach( el => el.addEventListener( event || 'click', this[ `_${name}` ] ) )
    },

    constructor( opts={} ) {

        if( opts.events ) { Object.assign( this.events, opts.events ); delete opts.events; }
        Object.assign( this, opts )

        this.subviewElements = [ ]

        if( this.requiresLogin && ( !this.user.isLoggedIn() ) ) return this.handleLogin()
        if( this.user && !this.isAllowed( this.user ) ) return this.scootAway()

        return this.initialize().render()
    },

    delegateEvents( key, el ) {
        var type = typeof this.events[key]

        if( type === "string" ) { this.bindEvent( key, this.events[key], el ) }
        else if( Array.isArray( this.events[key] ) ) {
            this.events[ key ].forEach( eventObj => this.bindEvent( key, eventObj ) )
        } else {
            this.bindEvent( key, this.events[key].event )
        }
    },

    delete( { silent } = { silent: false } ) {
        return this.hide()
        .then( () => {
            const container = this.els.container,
                parent = container.parentNode
            if( container && parent ) parent.removeChild( container )
            if( !silent ) this.emit('deleted')
            return Promise.resolve()
        } )
    },

    events: {},

    fadeInImage( el ) {
        el.onload = () => {
            this.emit( 'imgLoaded', el )
            el.removeAttribute('data-src')
        }

        el.setAttribute( 'src', el.getAttribute('data-src') )
    },

    getEventMethodName( key, event ) { return `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` },

    getContainer() { return this.els.container },

    getTemplateOptions() {
        const rv = Object.assign( this.user ? { user: this.user.data } : {},  this.Format )

        if( this.model ) {
            rv.model = this.model.data

            if( this.model.meta ) rv.meta = this.model.meta
            if( this.model.attributes ) rv.attributes = this.model.attributes
        }

        if( this.templateOptions ) rv.opts = typeof this.templateOptions === 'function' ? this.templateOptions() : this.templateOptions || {}

        return rv
    },

    handleLogin() {
        this.factory.create( 'login', { insertion: { el: document.querySelector('#content') } } )
        .on( "loggedIn", () => this.onLogin() )

        return this
    },

    hide( isSlow ) {
        //views not hiding consistently with this
        //if( !this.els || this.isHiding ) return Promise.resolve()

        this.isHiding = true;
        return this.hideEl( this.els.container, isSlow )
        .then( () => Promise.resolve( this.hiding = false ) )
    },
    
    hideSync() { this.els.container.classList.add('hidden'); return this },

    _hideEl( el, resolve, hash, isSlow ) {
        el.removeEventListener( 'animationend', this[ hash ] )
        el.classList.add('hidden')
        el.classList.remove(`animate-out${ isSlow ? '-slow' : ''}`)
        delete this[hash]
        this.isHiding = false
        resolve()
    },

    hideEl( el, isSlow ) {
        if( this.isHidden( el ) ) return Promise.resolve()

        const time = new Date().getTime(),
            hash = `${time}Hide`
        
        return new Promise( resolve => {
            this[ hash ] = e => this._hideEl( el, resolve, hash, isSlow )
            el.addEventListener( 'animationend', this[ hash ] )
            el.classList.add(`animate-out${ isSlow ? '-slow' : ''}`)
        } )
    },

    htmlToFragment( str ) {
        return this.factory.range.createContextualFragment( str )
    },

    initialize() {
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view', name: 'data-name', img: 'data-src' }, views: { } } )
    },

    insertToDom( fragment, options ) {
        const insertion = typeof options.insertion === 'function' ? options.insertion() : options.insertion;

        insertion.method === 'insertBefore'
            ? insertion.el.parentNode.insertBefore( fragment, insertion.el )
            : insertion.el[ insertion.method || 'appendChild' ]( fragment )
    },

    isAllowed( user ) {
        if( !this.requiresRole ) return true
            
        const userRoles = new Set( user.data.roles )

        if( typeof this.requiresRole === 'string' ) return userRoles.has( this.requiresRole )

        if( Array.isArray( this.requiresRole ) ) {
            const result = this.requiresRole.find( role => userRoles.has( role ) )

            return result !== undefined
        }

        return false
    },
    
    isHidden( el ) { return el ? el.classList.contains('hidden') : this.els.container.classList.contains('hidden') },

    onLogin() {

        if( !this.isAllowed( this.user ) ) return this.scootAway()

        this.initialize().render()
    },

    onNavigation() {
        return this.show()
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    render() {
        if( this.data ) this.model = Object.create( this.Model, { } ).constructor( this.data )

        this.slurpTemplate( {
            insertion: this.insertion || { el: document.body },
            isView: true,
            storeFragment: this.storeFragment,
            template: this.template( this.getTemplateOptions() )
        } )

        this.renderSubviews()

        if( this.size ) { this.size(); this.OptimizedResize.add( this.size.bind(this) ) }

        return this.postRender()
    },

    removeChildren( el ) {
        while( el.firstChild ) el.removeChild( el.firstChild )
        return this
    },

    renderSubviews() {
        this.subviewElements.forEach( obj => {
            const name = obj.name || obj.view

            let opts = { }

            if( this.Views && this.Views[ obj.view ] ) opts = typeof this.Views[ obj.view ] === "object" ? this.Views[ obj.view ] : Reflect.apply( this.Views[ obj.view ], this, [ ] )
            if( this.Views && this.Views[ name ] ) opts = typeof this.Views[ name ] === "object" ? this.Views[ name ] : Reflect.apply( this.Views[ name ], this, [ ] )

            this.views[ name ] = this.factory.create( obj.view, Object.assign( { insertion: { el: obj.el, method: 'insertBefore' } }, opts ) )

            if( this.events.views ) {
                if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
                else if( this.events.views[ obj.view ] ) this.events.views[ obj.view ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
            }

            if( obj.el.classList.contains('hidden') ) this.views[name].hideSync()
            obj.el.remove()
        } )

        this.subviewElements = [ ]

        return this
    },

    scootAway() {
        this.Toast.showMessage( 'error', 'You are not allowed here.')
        .catch( e => { this.Error( e ); this.emit( 'navigate', `/` ) } )
        .then( () => this.emit( 'navigate', `/` ) )

        return this
    },

    show( isSlow ) {
        return this.showEl( this.els.container, isSlow )
    },

    showSync() { this.els.container.classList.remove('hidden'); return this },

    _showEl( el, resolve, hash, isSlow ) {
        el.removeEventListener( 'animationend', this[hash] )
        el.classList.remove(`animate-in${ isSlow ? '-slow' : ''}`)
        delete this[ hash ]
        resolve()
    },

    showEl( el, isSlow ) {
        const time = new Date().getTime(),
            hash = `${time}Show`

        return new Promise( resolve => {
            this[ hash ] = e => this._showEl( el, resolve, hash, isSlow )
            el.addEventListener( 'animationend', this[ hash ] )
            el.classList.remove('hidden')
            el.classList.add(`animate-in${ isSlow ? '-slow' : ''}`)
        } )        
    },

    slurpEl( el ) {
        const key = el.getAttribute( this.slurp.attr ) || 'container'

        if( key === 'container' ) {
            el.classList.add( this.name )
            if( this.klass ) el.classList.add( this.klass )
        }

        this.els[ key ] = Array.isArray( this.els[ key ] )
            ? this.els[ key ].concat( el )
            : ( this.els[ key ] !== undefined )
                ? [ this.els[ key ], el ]
                : el

        el.removeAttribute(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate( options ) {
        var fragment = this.htmlToFragment( options.template ),
            selector = `[${this.slurp.attr}]`,
            viewSelector = `[${this.slurp.view}]`,
            imgSelector = `[${this.slurp.img}]`,
            firstEl = fragment.querySelector('*')

        if( options.isView || firstEl.getAttribute( this.slurp.attr ) ) this.slurpEl( firstEl )
        Array.from( fragment.querySelectorAll( `${selector}, ${viewSelector}, ${imgSelector}` ) ).forEach( el => {
            if( el.hasAttribute( this.slurp.attr ) ) { this.slurpEl( el ) }
            else if( el.hasAttribute( this.slurp.img ) ) this.fadeInImage( el )
            else if( el.hasAttribute( this.slurp.view ) ) {
                this.subviewElements.push( { el, view: el.getAttribute(this.slurp.view), name: el.getAttribute(this.slurp.name) } )
            }
        } )
   
        if( options.storeFragment ) return Object.assign( this, { fragment } )

        this.insertToDom( fragment, options )

        if( options.renderSubviews ) this.renderSubviews()

        return this
    },

    unbindEvent( key, event, el ) {
        const els = el ? [ el ] : Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ],
           name = this.getEventMethodName( key, event )

        els.forEach( el => el.removeEventListener( event || 'click', this[ `_${name}` ] ) )
    }
} )
