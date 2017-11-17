module.exports = Object.assign( {}, require('./__proto__'), {

    Templates: {
        DivisionResult: require('./templates/DivisionResult' ),
        Sponsor: require('./templates/Sponsor')
    },

    insertAllDivisions( data, sponsorData ) {
        let sponsorStart = 0,
            sponsorEnd = 3

        Object.keys( data ).sort().forEach( division => {
            const sponsors = sponsorData.slice( sponsorStart, sponsorEnd ).map( datum => this.Templates.Sponsor( datum, this.Format.ImageSrc ) ).join('')

            this.slurpTemplate( {
                template: this.Templates.DivisionResult( { name: division, data: data[ division ], sponsors } ),
                insertion: { el: this.els.divisions }
            } )

            sponsorStart += 3
            sponsorEnd += 3
        } )

        return this
    },

    update( name, data, sponsorData ) {
        this.els.divisions.innerHTML = ''

        if( name === 'All' ) return this.insertAllDivisions( data, sponsorData )

        const sponsors = sponsorData.map( datum => this.Templates.Sponsor( datum, this.Format.ImageSrc ) ).join('')

        this.slurpTemplate( {
            template: this.Templates.DivisionResult( { name, data, sponsors, message: true } ),
            insertion: { el: this.els.divisions }
        } )

        return this
    }

} )