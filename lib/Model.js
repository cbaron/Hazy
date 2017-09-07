module.exports = Object.assign( { }, require('./MyObject'), {

    CreateDefault() {
        return this.reducer( this.attributes, attr => ( { [attr.name]: typeof attr.default === 'function' ? attr.default() : attr.default } ) )
    },

    attributes: [ ],

    data: { },

    constructor( data={}, opts={} ) {
        Object.assign( this, { store: { }, data }, opts )

        if( this.storeBy ) {
            this.storeBy.forEach( key => this.store[ key ] = { } )
            this._store()
        }

        return this
    },

    meta: { },

    sort( opts ) {
        const attr = Object.keys( opts )[0],
            value = opts[attr];

        this.data.sort( ( a, b ) =>
            value
                ? a[attr] < b[attr] ? -1 : 1
                : b[attr] < a[attr] ? -1 : 1
        )

        return this
    },

    _store() {
        this.data.forEach( datum => this.storeBy.forEach( attr => this._storeAttr( datum, attr ) ) )
    },

    _storeAttr( datum, attr ) {
        this.store[ attr ][ datum[ attr ] ] =
            this.store[ attr ][ datum[ attr ] ]
                ? Array.isArray( this.store[ attr ][ datum[ attr ] ] )
                    ? this.store[ attr ][ datum[ attr ] ].concat( datum )
                    :[ this.store[ attr ][ datum[ attr ] ], datum ]
                : datum
    },

    _storeOne( datum ) {
        this.storeBy.forEach( attr => this._storeAttr( datum, attr ) )
    }

} )
