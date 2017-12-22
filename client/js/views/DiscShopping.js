module.exports = Object.assign( {}, require('./__proto__'), {

    DiscClass: Object.create( require('../models/__proto__'), { resource: { value: 'DiscClass' } } ),
    Manufacturer: Object.create( require('../models/__proto__'), { resource: { value: 'Manufacturer' } } ),
    DocumentModel: require('../models/Document'),
    model: require('../models/DiscShopping'),

    Templates: {
        Disc: require('./templates/Disc'),
        DiscType: require('./templates/DiscType'),
        Filter: require('./templates/Filter')
    },

    events: {
        filters: 'click',
        minMaxBtn: 'click',
        views: {
            availableDiscs: [
                [ 'discDetailsClicked', function( model ) {
                    this.emit( 'navigate', model.name, { append: true } )
                } ]
            ],
            productDetails: [
                [ 'addToCart', function( model ) {
                    this.user.addToCart( model )
                    this.emit( 'navigate', '/shop/cart' )
                } ]
            ],
            discTypes: [
                [ 'paginate', function() {
                    window.requestAnimationFrame( () => this.views.discTypes.fetch( true, {
                        query: this.discTypeQuery,
                        parse: this.views.discTypes.collection.parse
                    } ).catch(this.Error) )
                } ],
                [ 'seeDiscsClicked', function( model ) { this.emit( 'navigate', model.name, { append: true } ) } ]
            ],
            typeAhead: [
                [ 'itemSelected', function( model ) { this.emit( 'navigate', model.name, { append: true } ) } ]
            ]
        }
    },

    Views: {
        availableDiscs() {
            return {
                events: {
                    discDetailsBtn: 'click'                    
                },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.DocumentModel ).constructor( [ ], { resource: 'Disc', meta: { key: 'name' } } ),
                } ),
                itemTemplate: ( datum, format ) => this.Templates.Disc( Object.assign( { }, { datum, typeDatum: this.selectedDiscType, ImageSrc: format.ImageSrc, Currency: format.Currency } ) ),
                templateOptions() {
                    return { name: 'Available Discs' }
                },
                onDiscDetailsBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    this.emit( 'discDetailsClicked', this.collection.store.name[ listEl.getAttribute('data-key') ] )
                }
            }
        },
        discTypes() {
            return {
                events: { seeDiscsBtn: 'click' },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.DocumentModel ).constructor( { }, {
                        meta: { key: 'name' },
                        resource: 'DiscType',
                        parse: response => {
                            if( !Array.isArray( response ) ) response = [ response ]

                            return response.map( datum => {
                                if( datum.DiscClass ) datum.DiscClass = this.DiscClass.store._id[ datum.DiscClass ].label
                                if( datum.Manufacturer ) datum.Manufacturer = this.Manufacturer.store._id[ datum.Manufacturer ].label

                                datum.collectionName = 'DiscType'
                            } )
                        }
                    } ),
                    scrollPagination: true,
                    pageSize: 9,
                    skip: 0,
                    sort: { 'label': 1 }
                } ),
                initializeScrollPagination() {
                    const listEl = this.els.list

                    this.onScrollPagination = e => {
                        if( this.fetching ) return
                        if( ( this.scrollHeight - ( listEl.scrollTop + this.offsetHeight ) ) < 100 ) this.emit('paginate')
                    }

                    listEl.addEventListener( 'scroll', this.onScrollPagination )
                },
                itemTemplate: ( datum, format ) => this.Templates.DiscType( Object.assign( { }, { datum, ImageSrc: format.ImageSrc, Currency: format.Currency } ) ),
                onSeeDiscsBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    this.emit( 'seeDiscsClicked', this.collection.store.name[ listEl.getAttribute('data-key') ] )
                }
            }
        },
        typeAhead() {
            return {
                templateOptions: { placeholder: 'Search Disc Types' },
                Resource: 'DiscType',
                Type: 'Document'
            }
        }
    },

    createLookupStage( query, category, pipeline ) {
        const lookup = { $lookup: {
            from: category.name,
            localField: category.name,
            foreignField: '_id',
            as: `_${category.name}`
        } },
            match = { $match: query }

        pipeline.push( lookup, match )
    },

    insertFilters() {
        this.model.meta.filterCategories.forEach( filter => {
            this.filters[ filter.name ] = [ ]
            const model = Object.create( this.Model ).constructor( { }, { resource: filter.name } );

            ( filter.minMax ? Promise.resolve() : model.get() )
            .then( () =>
                this.slurpTemplate( {
                    template: this.Templates.Filter( { filter, data: model.data || [ ] } ),
                    insertion: { el: this.els.filters }
                } )
            )
            .catch( this.Error )
        } )
    },

    onFiltersClick( e ) {
        if( e.target.tagName !== "INPUT" || e.target.getAttribute('type') !== 'checkbox' ) return

        const inputEl = e.target,
            filterCategory = inputEl.closest('.filter').getAttribute('data-name'),
            filter = inputEl.getAttribute('data-name') || inputEl.getAttribute('data-id')

        if( inputEl.checked ) this.filters[ filterCategory ].push( filter )
        else {
            const index = this.filters[ filterCategory ].indexOf( filter )
            this.filters[ filterCategory ].splice( index, 1 )
        }

        this.update()
    },

    onMinMaxBtnClick( e ) {
        const filterEl = e.target.closest('.filter')
        if( !filterEl ) return

        const min = filterEl.querySelector('input[placeholder="Min"]').value,
            max = filterEl.querySelector('input[placeholder="Max"]').value

        let query = { }
        if( min ) query.$gte = min
        if( max ) query.$lte = max

        this.filters[ filterEl.getAttribute('data-name') ].push( query )

        this.update()
    },

    onNavigation( path ) {
        this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => {
            if( path.length > 1 ) {
                const discTypeDatum = this.views.discTypes.collection.store.name[ path[1] ];
                 
                return ( discTypeDatum
                    ? Promise.resolve( discTypeDatum )
                    : this.views.discTypes.collection.get( { parse: this.views.discTypes.collection.parse, query: { aggregate: [
                        { $match: { name: path[1] } },
                        { $lookup: {
                            from: 'Disc',
                            localField: '_id',
                            foreignField: 'DiscType',
                            as: '_Disc'
                        } },
                        { $match: { '_Disc.isSold': 'false' } }
                      ] } } )
                )
                .then( discTypeDatum => {
                    if( path.length === 2 ) return this.showAvailableDiscs( discTypeDatum )
                    if( path.length > 2 ) {
                        const discDatum = discTypeDatum._Disc.find( discDatum => discDatum.name === path[2] )
                        return discDatum ? this.showDiscDetails( discDatum, discTypeDatum ) : Promise.resolve()
                    }
                } )
                .catch( this.Error )
            }

            return Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
            .then( () => Promise.all( [ this.views.typeAhead.show(), this.views.discTypes.show(), this.showEl( this.els.leftPanel ) ] ) )

        } )
        .catch( this.Error )
    },

    postRender() {
        this.filters = { }

        this.discTypeQuery = {
            aggregate: [
                { $lookup: {
                    from: 'Disc',
                    localField: '_id',
                    foreignField: 'DiscType',
                    as: '_Disc'
                } },
                { $match: { '_Disc.isSold': 'false' } }
            ]
        }

        Promise.all( [
            this.DiscClass.get( { storeBy: ['_id'] } ),
            this.Manufacturer.get( { storeBy: ['_id'] } ),
            this.views.discTypes.fetch( false, { query: this.discTypeQuery } )
        ] )
        .then( () => {
            this.insertFilters()
            if( this.path.length > 1 ) this.onNavigation( this.path )
        } )
        .catch( this.Error )

        return this
    },

    showAvailableDiscs( datum ) {
        this.selectedDiscType = datum

        return Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ).concat( this.hideEl( this.els.leftPanel ) ) )
        .then( () => this.views.availableDiscs.show() )
        .then( () => {
            if( datum._Disc.length ) datum._Disc = datum._Disc.filter( disc => disc.isSold === 'false' )
            this.views.availableDiscs.els.heading.textContent = `Available ${datum.label} Discs`
            return Promise.resolve( this.views.availableDiscs.update( datum._Disc ) )
        } )
        .catch( this.Error )
    },

    showDiscDetails( discModel, discTypeModel ) {
        return Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ).concat( this.hideEl( this.els.leftPanel ) ) )
        .then( () => this.views.productDetails.show() )
        .then( () => Promise.resolve( this.views.productDetails.update( discModel, discTypeModel ) ) )
        .catch( this.Error )
    },

    update() {
        const pipeline = [ { $lookup:
            {
                from: 'Disc',
                localField: '_id',
                foreignField: 'DiscType',
                as: '_Disc'
            }
        } ]

        let discMatch = { $match: { $and: [ { '_Disc.isSold': 'false' } ] } }

        pipeline.push( discMatch )

        this.model.meta.filterCategories.forEach( category => {
            let query = { }

            if( !this.filters[ category.name ] || !this.filters[ category.name ].length ) return

            const filters = this.filters[ category.name ].map( filter => {
                const key = category.fk
                    ? `_${category.name}.name`
                    : `_${category.collection}.${category.name}`

                const val = category.fk ? this[ category.name ].store._id[ filter ].name : filter
                
                return { [ key ]: val }
            } )

            if( filters.length === 1 ) query = filters[0]
            else if( filters.length > 1 ) query[ '$or' ] = filters

            if( category.collection === 'Disc' ) discMatch.$match.$and.push( query )
            else this.createLookupStage( query, category, pipeline )
        } )

        this.discTypeQuery = { aggregate: pipeline }

        this.views.discTypes.collection.data = { }
        this.views.discTypes.model.set( 'skip', 0 )
        this.views.discTypes.empty()
 
        return this.views.discTypes.fetch( false, { query: this.discTypeQuery } )
        .then( () => this.views.discTypes.initializeScrollPagination() )
        .catch( this.Error )
    }

} )