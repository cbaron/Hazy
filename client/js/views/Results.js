module.exports = Object.assign( {}, require('./__proto__'), {

    Byops: Object.create( require('../models/__proto__'), { resource: { value: 'byop2017Results' } } ),
    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),
    Sponsors: Object.create( require('../models/__proto__'), { resource: { value: 'byopSponsor' } } ),

    events: {
        divisionsList: 'click'
    },

    insertDivisionList() {
        this.Divisions.sort( { attr: 'name' } )
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

        this.views.divisionResults.update( 'All', this.Byops.store.division, this.Sponsors.data ).show().catch( this.Error )
    },

    onDivisionsListClick( e ) {
        if( e.target.tagName !== 'LI' || e.target === this.selectedDivision ) return
        const el = e.target,
            division = el.getAttribute('data-label')

        if( this.selectedDivision ) this.selectedDivision.classList.remove('selected')
        el.classList.add('selected')
        this.selectedDivision = el

        const data = division === 'All' ? this.Byops.store.division : this.Byops.store.division[ division ]

        this.views.divisionResults.update( division, data, this.Sponsors.data ).show().catch( this.Error )
    },

    postRender() {
        Promise.all( [
            this.Divisions.get(),
            this.Byops.get( { storeBy: [ 'division' ] } ),
            this.Sponsors.get( { query: { organizationId: { operation: 'join', value: { table: 'organization', column: 'id' } } } } )
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

            this.shuffleArray( this.Sponsors.data ).sort( ( a, b ) => b['byopSponsor.year'] - a['byopSponsor.year'] )

            this.insertDivisionList()
            
        } )
        .catch( e => this.Error(e) )

        return this
    }

} )
