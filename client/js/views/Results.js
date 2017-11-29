module.exports = Object.assign( {}, require('./__proto__'), {

    Byops: Object.create( require('../models/__proto__'), { resource: { value: 'byop2017Results' } } ),
    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),
    Sponsors: Object.create( require('../models/__proto__'), { resource: { value: 'byopSponsor' } } ),

    events: {
        divisionsList: 'click'
    },

    Templates: {
        DivisionResult: require('./templates/DivisionResult' ),
        Sponsor: require('./templates/Sponsor')
    },

    insertAllDivisions( data ) {
        const sponsorNum = Math.floor( this.els.divisionsList.getBoundingClientRect().width / 272 )

        let sponsorStart = 0,
            sponsorEnd = sponsorNum

        Object.keys( data ).sort().forEach( division => {
            const sponsors = this.Sponsors.data.slice( sponsorStart, sponsorEnd ).map( datum => this.Templates.Sponsor( datum, this.Format.ImageSrc ) ).join('')

            this.slurpTemplate( {
                template: this.Templates.DivisionResult( { name: division, data: data[ division ], sponsors } ),
                insertion: { el: this.els.divisionResults }
            } )

            sponsorStart += sponsorNum
            sponsorEnd += sponsorNum

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

        this.update( division, data, this.Sponsors.data )
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

            this.insertDivisionList()
            
        } )
        .catch( this.Error )

        return this
    },

    update( name, data ) {
        this.Sponsors.data = this.shuffleArray( this.Sponsors.data ).sort( ( a, b ) => b['byopSponsor.year'] - a['byopSponsor.year'] )

        this.hideEl( this.els.divisionResults )
        .then( () => {
            this.els.divisionResults.innerHTML = ''

            if( name === 'All' ) return this.insertAllDivisions( data )

            const sponsors = this.Sponsors.data.map( datum => this.Templates.Sponsor( datum, this.Format.ImageSrc ) ).join('')

            this.slurpTemplate( {
                template: this.Templates.DivisionResult( { name, data, sponsors, message: true } ),
                insertion: { el: this.els.divisionResults }
            } )
        } )
        .then( () => this.showEl( this.els.divisionResults ) )
        .catch( this.Error )
    }

} )
