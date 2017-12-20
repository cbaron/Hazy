module.exports = Object.assign( {}, require('./__proto__'), {

    DiscClass: Object.create( require('../models/__proto__'), { resource: { value: 'DiscClass' } } ),
    Manufacturer: Object.create( require('../models/__proto__'), { resource: { value: 'Manufacturer' } } ),
    DocumentModel: require('../models/Document'),
    model: require('../models/DiscShopping'),

    Templates: {
        DiscType: require('./templates/DiscType'),
        Filter: require('./templates/Filter')
    },

    events: {
        filters: 'click',
        minMaxBtn: 'click'
    },

    Views: {
        availableDiscs() {
            return {
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.DocumentModel ).constructor( [ ], { resource: 'Disc' } ),
                } ),
                itemTemplate: datum => `<div><img src="${this.Format.ImageSrc( datum.PhotoUrls[0] )}"/></div>`
            }
        },
        discTypes() {
            return {
                events: { seeDiscsBtn: 'click' },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.DocumentModel ).constructor( [ ], { resource: 'DiscType' } ),
                    scrollPagination: true,
                    pageSize: 9
                } ),
                itemTemplate: ( datum, format ) => this.Templates.DiscType( Object.assign( { }, { datum, ImageSrc: format.ImageSrc, Currency: format.Currency, addToCart: true } ) ),
                /*onAddToCartBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    this.emit( 'addToCart', listEl.getAttribute('data-key') )
                }*/
                onSeeDiscsBtnClick( e ) {
                    const listEl = e.target.closest('li')
                    if( !listEl ) return
                    this.emit( 'seeDiscsClicked', this.collection.store._id[ listEl.getAttribute('data-key') ] )
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

    insertDiscs( data ) {
        console.log( 'insertDiscs' )
        console.log( data )


        data.forEach( datum => {

            datum.DiscClass = this.DiscClass.store._id[ datum.DiscClass ].label
            datum.Manufacturer = this.Manufacturer.store._id[ datum.Manufacturer ].label

            datum.quantity = 1
            datum.collectionName = 'DiscType'

            this.views.discTypes.add( datum )

        } )
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
            //filterDatum = this.model.meta.filterCategories.find( datum => datum.name === filterCategory )
            filter = inputEl.getAttribute('data-name') || inputEl.getAttribute('data-id')

        if( inputEl.checked ) this.filters[ filterCategory ].push( filter )
        else {
            const index = this.filters[ filterCategory ].indexOf( filter )
            this.filters[ filterCategory ].splice( index, 1 )
        }

        this.update()
    },

    onMinMaxBtnClick( e ) {
        console.log( 'onMinMaxBtnClick' )
        console.log( e.target )
        const filterEl = e.target.closest('.filter')
        if( !filterEl ) return

        const min = filterEl.querySelector('input[placeholder="Min"]').value,
            max = filterEl.querySelector('input[placeholder="Max"]').value

        console.log( filterEl )
        console.log( min )
        console.log( max )

        let query = { }
        if( min ) query.$gte = min
        if( max ) query.$lte = max

        console.log( query )

        this.filters[ filterEl.getAttribute('data-name') ].push( query )

        this.update()
    },

    onNavigation( path ) {
        this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .catch( this.Error )
    },

/*let's include filters for disc class, manufacturer, weight
and add a typeahead where the person can search by disc type label
It will probably be best to use aggregate functions 
please run those statements by me so that I can sign off on them
utilize pagination as is done in the collection manager, let's say 9 at a time for now
we want to display `DiscTypes` that have discs available for sale 
don't put the typeahead on the left, include it in the center (edited)

db.Disc.aggregate( [
    { $match: { weight: { $lte: '160' }, isSold: 'false' } },
    { $lookup:
        {
            from: 'DiscType',
            localField: 'DiscType',
            foreignField: '_id',
            as: 'Disc_Types'
        }
    },
    { $lookup:
        {
            from: 'Manufacturer',
            localField: 'Disc_Types.Manufacturer',
            foreignField: '_id',
            as: 'manufacturer'
        }
    },
    { $match: { 'manufacturer.name': 'axiom' } },
    { $project: { 'Disc_Types': 0, 'manufacturer': 0 } }
] )


*/

    postRender() {
        this.filters = { }

        Promise.all( [
            this.DiscClass.get( { storeBy: ['_id'] } ),
            this.Manufacturer.get( { storeBy: ['_id'] } ),
            this.views.discTypes.collection.get( { query: { limit: 9, aggregate: [
                { $lookup: {
                    from: 'Disc',
                    localField: '_id',
                    foreignField: 'DiscType',
                    as: '_Disc'
                } },
                { $match: { '_Disc.isSold': 'false' } }
            ] } } )
        ] )
        .then( () => {
            this.insertFilters()
            this.insertDiscs( this.views.discTypes.collection.data )
        } )
        .catch( this.Error )

        this.views.discTypes.on( 'seeDiscsClicked', datum => {
            console.log( 'seeDiscsClicked' )
            console.log( datum )
            console.log( datum._Disc )
            this.showAvailableDiscs( datum )
        } )

        this.views.discTypes.on( 'addToCart', id => {
            this.user.addToCart( this.model.store['_id'][id] )
            this.emit( 'navigate', '/shop/cart' )
        } )

        return this
    },

    showAvailableDiscs( datum ) {
        this.views.discTypes.hide()
        .then( () => this.views.availableDiscs.show() )
        .then( () => this.views.availableDiscs.update( datum._Disc ) )
        .catch( this.Error )
    },

    update() {
/*db.DiscType.aggregate( [
    { $lookup:
        {
            from: 'Disc',
            localField: '_id',
            foreignField: 'DiscType',
            as: '_disc'
        }
    },
    { $match: { '_disc.weight': { $gt: '158' }, '_disc.isSold': 'false' } },
    { $lookup:
        {
            from: 'Manufacturer',
            localField: 'Manufacturer',
            foreignField: '_id',
            as: '_manufacturer'
        }
    },
    { $match: { '_manufacturer.name': 'axiom' } }
] )*/
        console.log( 'update' )
        //console.log( this.filters )
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

            console.log( 'filters' )
            console.log( filters )

            if( filters.length === 1 ) query = filters[0]
            else if( filters.length > 1 ) query[ '$or' ] = filters
            //console.log( query )

            if( category.collection === 'Disc' ) discMatch.$match.$and.push( query )
            else this.createLookup( query, category, pipeline )
        } )

        console.log( pipeline )

        this.views.discTypes.collection.data = [ ]
        this.views.discTypes.empty()
 
        return this.views.discTypes.collection.get( { query: { aggregate: pipeline } } )
        .then( () => this.insertDiscs( this.views.discTypes.collection.data ) )
        .catch( this.Error )
    },

    createLookup( query, category, pipeline ) {
        const lookup = { $lookup: {
            from: category.name,
            localField: category.name,
            foreignField: '_id',
            as: `_${category.name}`
        } },
            match = { $match: query }

        pipeline.push( lookup, match )

    }

} )