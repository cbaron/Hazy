module.exports = Object.create( Object.assign( require('../../lib/MyObject'), {

    Enum: require('../../lib/Enum'),

    Request: require('./Request'),

    Tokens: require('./Tokens'),

    constructor() { return this.factory.bind(this) },

    getRandomItem( arr ) {
        return arr[ Math.floor( Math.random() * arr.length ) ]
    },

    Boolean() { return Math.random() > 0.5 },

    Text( column ) {
        if( column.name === 'name' ) return `${this.getRandomItem(this.Tokens)} ${this.getRandomItem(this.Tokens)}`

        const length = this.getRandomInclusiveInteger( column.maximumCharacterLength / 2, column.maximumCharacterLength )
        let rv = ''

        while( rv.length < length ) { rv += `${this.getRandomItem( this.Tokens )} ` }

        if( rv.length > length ) while( rv.length > length ) { rv = rv.slice( 0, rv.lastIndexOf(' ') ) }
        
        if( rv.slice(-1) === ' ' ) rv = rv.slice( 0, -1 )
        
        return rv
    },

    Date() { return this.Moment().utc().format('YYYY-MM-DD') },
    
    Integer() { return Math.floor( Math.random() * 10 ) },
    
    Float() { return Math.random() * 100 },
    
    Fk( column, opts ) {
        return this.Request( { headers: opts.headers || { }, path: `/${column.fk.table}` } )
        .then( ( [ body ] ) =>
            body.length === 0
                ? Promise.reject(`No ${column.fk.table} resources`)
                : Promise.resolve( body[ Math.floor( Math.random() * ( body.length - 0)) + 0 ].id )
        )
    },
    
    DateTime() { return this.Moment().utc().format() },

    factory( column, opts={} ) {
        return column.fk
            ? this.Fk( column, opts )
            : column.isEnum
                ? Array.isArray( this.Enum[ column.range ] )
                    ? Array.isArray( column.range )
                        ? Promise.resolve( this.shuffleArray( this.Enum[ column.range ] ).splice( 0, this.getRandomInclusiveInteger( 1, this.Enum[ column.range ].length - 1 ) ) )
                        : Promise.resolve( this.getRandomItem( this.Enum[ column.range ] ) )
                    : Promise.resolve( this.Enum[ column.range ].create() )
                : Promise.resolve( this[ column.range ]( column ) )
    },

} ) ).constructor()
