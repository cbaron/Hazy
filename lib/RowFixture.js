module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), {

    apply( name, opts ) { return this[ name ]( opts ) },

    constructor() {
        return this.apply.bind(this)
    },
    
    Photo( {w: w, h: h} = { w: 300, h: 300 } ) {
        const qs = `${new Date().getTime()}${this.getRandomInclusiveInteger( 1, 1000 )}`
        return {
            w,
            h,
            uri: `http://loremflickr.com/${w}/${h}?${qs}`
        }
    }
} ) ).constructor()
