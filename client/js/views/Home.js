module.exports = Object.assign( {}, require('./__proto__'), {

    data: [
        'boom',
        'dga',
        'disc-mania',
        'discraft',
        'dynamic',
        'innova',
        'latitude',
        'legacy',
        'millenium',
        'westside'
    ],

    events: {
        byopBtn: 'click',
        byopResultsBtn: 'click',
        ezFinder: 'click',
        giftCardBtn: 'click'
    },

    onByopBtnClick() {
        this.emit( 'navigate', 'byop' )
    },

    onByopResultsBtnClick() {
        this.emit( 'navigate', 'results' )
    },
    
    onEzFinderClick() {
        this.emit( 'navigate', 'shop' )
    },

    onGiftCardBtnClick() {
        this.emit( 'navigate', 'gift-cards' )
    },

    postRender() {
        this.on( 'imgLoaded', el => {
            if( !el.parentNode ) return
            el.parentNode.nextElementSibling.classList.remove('hidden')
        } )

        return this
    },

    size() {
        const images = { headerImage: 'header-image.jpg', giftCardBgImage: 'homepage-giftcard-bg.jpg', byopImage: 'homepage-byop.jpg' }

        if ( window.matchMedia("(max-width: 767px)").matches ) {
            images.headerImage = 'header-image-mobile.jpg'
            images.giftCardBgImage = 'homepage-giftcard-bg-mobile.jpg'
            images.byopImage = 'homepage-byop-mobile.jpg'
        }

        Object.keys( images ).forEach( name => {
            const el = this.els[ name ]
            el.innerHTML = ''

            this.slurpTemplate( {
                template: `<img data-src="${this.Format.ImageSrc( images[ name ] )}"/>`,
                insertion: { el: this.els[ name ] }
            } )
        } )

        return true
    }

} )
