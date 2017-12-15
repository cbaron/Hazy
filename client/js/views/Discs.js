module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Discs'),

    Templates: {
        Disc: require('./templates/Disc'),
        Filter: require('./templates/Filter')
    },

    events: {
        filters: 'click',
    },

    Views: {
        productResults() {
            return {
                events: { addToCartBtn: 'click' },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Model ).constructor( [ ], { meta: { key: '_id' } } ),

                } ),
                itemTemplate: ( datum, format ) => this.Templates.Disc( Object.assign( { }, { datum, ImageSrc: format.ImageSrc, Currency: format.Currency, addToCart: true } ) ),
                onAddToCartBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    this.emit( 'addToCart', listEl.getAttribute('data-key') )
                }
            }
        }
    },

    insertDiscs( data ) {
        data.forEach( datum =>
            this.Xhr( { resource: 'DiscType', id: datum.DiscType } )
            .then( discTypeDoc => {
                datum.DiscType = discTypeDoc.label

                const discClass = this.DiscClasses.data.find( klass => klass._id === discTypeDoc.DiscClass )
                datum.DiscClass = discClass ? discClass.label : ``
                datum.quantity = 1
                datum.collectionName = 'Disc'

                this.views.productResults.add( datum )

            } )
            .catch( this.Error )
        )
    },

    insertFilters() {
        this.model.meta.filterCategories.forEach( filter => {
            this.filters[ filter.name ] = [ ]
            const model = Object.create( this.Model ).constructor( { }, { resource: filter.name } )

            model.get()
            .then( () =>
                this.slurpTemplate( {
                    template: this.Templates.Filter( { name: filter.name, label: filter.label, fk: filter.fk, data: model.data } ),
                    insertion: { el: this.els.filters }
                } )
            )
            .catch( this.Error )
        } )
    },

    onFiltersClick( e ) {
        if( e.target.tagName !== "INPUT" ) return

        const inputEl = e.target,
            filter = inputEl.getAttribute('data-name') || inputEl.getAttribute('data-id'),
            filterCategory = inputEl.closest('.filter').getAttribute('data-name')

        if( inputEl.checked ) this.filters[ filterCategory ].push( filter )
        else {
            const index = this.filters[ filterCategory ].indexOf( filter )
            this.filters[ filterCategory ].splice( index, 1 )
        }

        this.update()
    },

    onNavigation( path ) {
        this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .catch( this.Error )
    },

    postRender() {
        this.filters = { }
        this.DiscClasses = Object.create( this.Model ).constructor( {}, { resource: 'DiscClass' } )

        Promise.all( [ this.DiscClasses.get(), this.model.get( { storeBy: ['_id'] } ) ] )
        .then( () => {
            this.insertFilters()
            this.insertDiscs( this.model.data )
        } )
        .catch( this.Error )

        this.views.productResults.on( 'addToCart', id => {
            this.user.addToCart( this.model.store['_id'][id] )
            this.emit( 'navigate', '/shop/cart' )
        } )

        return this
    },

    update() {
        this.model.data = [ ]
        this.els.inventory.innerHTML = ''

        let query = { }

        const queries = Object.keys( this.filters ).reduce( ( memo, key ) => {
            if( this.filters[ key ].length ) {
                this.filters[ key ].forEach( filter => memo.push( { [key]: filter } ) )
            }
            return memo
        }, [ ] )


        if( queries.length === 1 ) query = queries[0]
        else if( queries.length > 1 ) query[ '$or' ] = queries

 
        this.model.get( { query } )
        .then( () => this.insertDiscs( this.model.data ) )
        .catch( this.Error )
    }

} )