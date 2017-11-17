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
        ezFinder: 'click'
    },

    onByopBtnClick() {
        this.emit( 'navigate', 'byop' )
    },

    onByopResultsBtnClick() {
        console.log( 'onByopResultsBtnClick' )
        this.emit( 'navigate', 'results' )
    },
    
    onEzFinderClick() {
        this.emit( 'navigate', 'shop' )
    }

} )
