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
        this.on( 'imgLoaded', el => el.nextElementSibling.classList.remove('hidden') )

        return this
    }

} )
