module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Discs'),

    Templates: {
        Disc: require('./templates/Disc'),
        Filter: require('./templates/Filter')
    },

    events: {
        filters: 'click'
    },

    insertDiscs() {
        this.model.get()
        .then( () => {
            console.log( this.model.data )
            this.model.data.forEach( datum =>
                this.slurpTemplate( {
                    template: this.Templates.Disc( Object.assign( datum, { ImageSrc: this.Format.ImageSrc } ) ),
                    insertion: { el: this.els.inventory }
                } )
            )
        })
        .catch( this.Error )
    },

    insertFilters() {
        this.model.git('filters').forEach( filter => {
            const model = Object.create( this.Model ).constructor( { }, { resource: filter.name } )

            console.log( model )
            model.get()
            .then( () =>
                this.slurpTemplate( {
                    template: this.Templates.Filter( { label: filter.label, data: model.data } ),
                    insertion: { el: this.els.filters }
                } )
            )
            .catch( this.Error )
        } )
    },

    onFiltersClick( e ) {
        console.log( 'onCategoriesClick' )
        if( e.target.tagName !== "INPUT" ) return

        const inputEl = e.target,
              categoryId = inputEl.value

        console.log( inputEl )
        console.log( categoryId )
        console.log( inputEl.checked )

        //if( this.markers[ categoryId ] ) this.markers[ categoryId ].forEach( marker => marker.setMap( inputEl.checked ? this.map : null ) )
    },

    postRender() {
        console.log( this.model )
        this.insertFilters()
        this.insertDiscs()

        return this
    }

} )