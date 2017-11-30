module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.on( 'imgLoaded', el => {
            if( !el.parentNode ) return
            el.parentNode.nextElementSibling.classList.remove('hidden')
        } )

        return this
    },

    size() {
        if( this.mobile === undefined ) this.mobile = false

        let image = 'footer-image.jpg'

        if ( window.matchMedia("(max-width: 767px)").matches ) {
            image = 'footer-image-mobile.jpg'
        }

        this.els.footerImage.innerHTML = ''

        this.slurpTemplate( {
            template: `<img data-src="${this.Format.ImageSrc( image )}"/>`,
            insertion: { el: this.els.footerImage }
        } )

        return true
    }

} )
