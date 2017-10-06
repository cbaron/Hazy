module.exports = Object.assign( { }, require('./__proto__'), {

    Byop: Object.create( require('../models/Byop') ),
    
    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),

    Templates: {
        ByopDiscSelection: require('./templates/DiscSelection'),
    },

    events: {
        heading: 'click',
        getAceSheet: 'click',
        getAllNames: 'click'
    },

    getDiscWeightClasses() {
        return [
            { min: 150, max: 160, count: 0 },
            { min: 161, max: 164, count: 0 },
            { min: 165, max: 169, count: 0 },
            { min: 170, max: 172, count: 0 },
            { min: 173, max: 175, count: 0 }
        ]
    },

    handleAceFund() {
        this.satAce = 0
        this.sunAce = 0

        const satDivisions = this.Divisions.data.filter( datum => datum.name === 'rec' || datum.name === 'int' ).reduce( ( memo, datum ) => Object.assign( memo, { [datum.id]: true } ), { } )

        this.Byop.data.forEach( datum => {
            if( satDivisions[ datum.divisionId ] ) {
                if( datum.ace1 === true ) this.satAce += 5
                if( datum.ace2 === true ) this.satAce += 5
            } else {
                if( datum.ace1 === true ) this.sunAce += 5
                if( datum.ace2 === true ) this.sunAce += 5
            }
        } )

        this.slurpTemplate( { template: `<div>Saturday: ${this.Format.Currency.format( this.satAce )}</div>`, insertion: { el: this.els.aceFund } } )
        this.slurpTemplate( { template: `<div>Sunday: ${this.Format.Currency.format( this.sunAce )}</div>`, insertion: { el: this.els.aceFund } } )
    },

    handleDiscs() {
        this.discs = {}

        Object.keys( this.Byop.store.disc1 ).forEach( disc => {
            if( this.discs[ disc ] === undefined ) this.discs[ disc ] = { weightClasses: this.getDiscWeightClasses(), unknowns: [ ] }

            let store = this.Byop.store.disc1[ disc ]
            if( !Array.isArray( store ) ) store = [ store ]

            store.forEach( datum => {
                const klass = this.discs[ disc ].weightClasses.find( klass => klass.min <= parseInt( datum.weight1 ) && klass.max >= parseInt( datum.weight1 ) )
                klass === undefined
                    ? this.discs[ disc ].unknowns.push( datum.weight1 || `(no value)` )
                    : klass.count++
            } )
        } )
        Object.keys( this.Byop.store.disc2 ).forEach( disc => {
            if( this.discs[ disc ] === undefined ) this.discs[ disc ] = { weightClasses: this.getDiscWeightClasses(), unknowns: [ ] }

            let store = this.Byop.store.disc2[ disc ]
            if( !Array.isArray( store ) ) store = [ store ]

            store.forEach( datum => {
                const klass = this.discs[ disc ].weightClasses.find( klass => klass.min <= parseInt( datum.weight2 ) && klass.max >= parseInt( datum.weight2 ) )
                klass === undefined
                    ? this.discs[ disc ].unknowns.push( datum.weight2 || `(no value)` )
                    : klass.count++
            } )
        } )

        Object.keys( this.discs ).forEach( disc => {
            const total = ( this.Byop.store.disc1[ disc ] ? this.Byop.store.disc1[ disc ].length : 0 ) + ( this.Byop.store.disc2[ disc ] ? this.Byop.store.disc2[ disc ].length : 0 )
            this.slurpTemplate( { template: this.Templates.ByopDiscSelection( { disc, total, meta: this.discs[ disc ] } ), insertion: { el: this.els.playerPack } } )

        } )
    },

    handlePaymentType() {
        const cashTotal = this.Byop.store.paidCash[ 'true' ].reduce( ( sum, datum ) => sum + parseFloat( datum.total ), 0 ),
            ccTotal = this.Byop.store.paidCash[ 'false' ].reduce( ( sum, datum ) => sum + parseFloat( datum.total ), 0 )

            this.slurpTemplate( { template: `<div>Cash: ${this.Format.Currency.format( cashTotal )}</div>`, insertion: { el: this.els.paidType } } )
            this.slurpTemplate( { template: `<div>Credit: ${this.Format.Currency.format( ccTotal )}</div>`, insertion: { el: this.els.paidType } } )
    },

    handleShirts() {
        this.shirts = {}

        Object.keys( this.Byop.store.shirtSize1 ).forEach( size => {
            if( this.shirts[ size ] === undefined ) this.shirts[ size ] = 0
            this.shirts[ size ] += Array.isArray( this.Byop.store.shirtSize1[ size ] ) ? this.Byop.store.shirtSize1[ size ].length : 1
        } )
        
        Object.keys( this.Byop.store.shirtSize2 ).forEach( size => {
            if( this.shirts[ size ] === undefined ) this.shirts[ size ] = 0
            this.shirts[ size ] += Array.isArray( this.Byop.store.shirtSize2[ size ] ) ? this.Byop.store.shirtSize2[ size ].length : 1
        } )

        Object.keys( this.shirts ).forEach( size => {
            this.slurpTemplate( { template: `<div>${size}: ${this.shirts[size]}</div>`, insertion: { el: this.els.shirts } } )
        } )
    },
    
    onHeadingClick() { this.els.content.classList.contains('hidden') ? this.showEl( this.els.content ) : this.hideEl( this.els.content ) },

    onGetAceSheetClick() {
        window.open( `/report?${ window.encodeURIComponent( JSON.stringify( { id: 'byopAce' } ) ) }` )
    },
    
    onGetAllNamesClick() {
        window.open( `/report?${ window.encodeURIComponent( JSON.stringify( { id: 'byopNames' } ) ) }` )
    },

    postRender() {

        Promise.all( [
            this.Divisions.get(),
            this.Byop.get( { query: { waitList: false, removedFromEvent: false }, storeBy: [ 'shirtSize1', 'shirtSize2', 'disc1', 'disc2', 'paidCash' ] } )
        ] )
        .then( () => {

            this.handleDiscs()

            this.handleShirts()

            this.els.belmontDonation.textContent =
                this.Format.Currency.format(
                    this.Byop.data.reduce(
                        ( sum, datum ) => {
                            const value = parseFloat( datum.belmontDonation )
                            return sum + ( Number.isNaN( value ) ? 0 : value )
                        },
                        0
                    )
                )

            this.handlePaymentType()
            
            this.handleAceFund()
        } )
        .catch( this.Error )

        return this
    }
} )
