module.exports = Object.assign( {}, require('./__proto__'), {

    Templates: { DiscDetails: require('./templates/DiscDetails') },

    events: {
        addToCartBtn: 'click',
        thumbnails: 'click'
    },

    onAddToCartBtnClick( e ) {
        this.emit( 'addToCart', this.model )
    },

    onThumbnailsClick( e ) {
        if( e.target.tagName !== 'IMG' ) return
        this.els.displayedImage.src = e.target.src
    },

    update( discModel, discTypeModel ) {
        this.model = discModel

        discModel.DiscClass = discTypeModel.DiscClass
        discModel.DiscType = discTypeModel.label

        this.els.discDetails.innerHTML = ''
        this.els = { container: this.els.container, discDetails: this.els.discDetails }

        this.slurpTemplate( {
            template: this.Templates.DiscDetails( { discModel, discTypeModel, ImageSrc: this.Format.ImageSrc, Currency: this.Format.Currency } ),
            insertion: { el: this.els.discDetails }
        } )

        this.els.container.scrollIntoView( { behavior: 'smooth' } )

        return this
    }

} )