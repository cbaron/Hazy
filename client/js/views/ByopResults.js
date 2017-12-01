module.exports = Object.assign( {}, require('./__proto__'), {

    Byops: Object.create( require('../models/__proto__'), { resource: { value: 'byop2017Results' } } ),
    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),

    events: {
        divisionsList: 'click'
    },

    Templates: {
        DivisionResult: require('./templates/DivisionResult' ),
    },

    insertAllDivisions( data ) {
        Object.keys( data ).sort().forEach( division => {
            this.slurpTemplate( {
                template: this.Templates.DivisionResult( { name: division, data: data[ division ] } ),
                insertion: { el: this.els.divisionResults }
            } )

        } )

        return this
    },

    insertDivisionList() {
        this.Divisions.sort( { name: 1 } )
        this.Divisions.data.unshift( { name: 'all', label: 'All' } )

        Object.keys( this.Byops.store.division ).forEach( label => {
            if( !this.Divisions.data.find( datum => datum.label === label ) ) delete this.Byops.store.division[ label ]
        } )

        this.slurpTemplate( {
            template: this.Format.GetListItems( this.Divisions.data, { dataAttr: 'label' } ),
            insertion: { el: this.els.divisionsList }
        } )

        this.selectedDivision = this.els.divisionsList.children[0]
        this.els.divisionsList.children[0].classList.add('selected')

        this.update( 'All', this.Byops.store.division )
    },

    onDivisionsListClick( e ) {
        if( e.target.tagName !== 'LI' || e.target === this.selectedDivision ) return

        const el = e.target,
            division = el.getAttribute('data-label')

        this.selectedDivision.classList.remove('selected')
        el.classList.add('selected')
        this.selectedDivision = el

        const data = division === 'All' ? this.Byops.store.division : this.Byops.store.division[ division ]

        this.update( division, data )
    },

    postRender() {
        Promise.all( [
            this.Divisions.get(),
            this.Byops.get( { storeBy: [ 'division' ] } ),
        ] )
        .then( () => {
            this.Byops.data.sort( ( a, b ) => {
                const aTotal = window.parseInt( a.total ),
                    bTotal = window.parseInt( b.total )
                    
                return window.isNaN( aTotal )
                    ? 1
                    : window.isNaN( bTotal )
                        ? -1
                        : aTotal - b.Total
            } )

            this.insertDivisionList()
            
        } )
        .catch( this.Error )

        return this
    },

    update( name, data ) {
        this.hideEl( this.els.divisionResults )
        .then( () => {
            this.els.divisionResults.innerHTML = ''

            if( name === 'All' ) return this.insertAllDivisions( data )

            this.slurpTemplate( {
                template: this.Templates.DivisionResult( { name, data } ),
                insertion: { el: this.els.divisionResults }
            } )
        } )
        .then( () => this.showEl( this.els.divisionResults ) )
        .catch( this.Error )
    }

} )
