module.exports = Object.create( {

    Mongo: require('../../dal/Mongo'),

    Postgres: require('../../dal/Postgres'),

    apply( resource ) {
        if( this.Mongo.model[ resource.path[0] ] ) return this.Mongo[ resource.request.method ]( resource )

        return this[ resource.request.method ]( resource )
    },

    DELETE() { return this.Postgres.query( `DELETE FROM "${resource.path[0]}" WHERE id = ${resource.path[1]} RETURNING id` ) },

    GET( resource ) {
        var paramCtr = 1,
            name = resource.path[0],
            queryKeys = ( resource.path.length > 1 ) ? { id: resource.path[1] } : Object.keys( resource.query || {} ),
            joins = [ ],
            where,
            selects = { [name]: true },
            whereList = [ ],
            params = [ ]

        if( this.Postgres[ `${name}s` ] ) return Promise.resolve( this.Postgres[ `${name}s` ].data )

        queryKeys.forEach( key => {
            const datum = resource.query[key],
                isObj = Boolean( typeof datum === 'object' ),
                operation = isObj ? datum.operation : `=`

            if( isObj && !this._validOperations.has( operation ) ) throw Error('Invalid Operation')

            if( /join/i.test( operation ) ) {
                let fkCol = this.Postgres.tables[ datum.value.table ].columns.find( column => column.name === datum.value.column )
                if( fkCol === undefined ) throw Error( `Invalid join ${key}: ${datum}` )
                joins.push( `${operation === 'leftJoin' ? 'LEFT' : ''} JOIN "${datum.value.table}" ON "${name}"."${key}" = "${datum.value.table}"."${datum.value.column}"` )
                selects[ datum.value.table ] = true
            } else {
                whereList.push(`"${name}"."${key}" ${operation} $${paramCtr++}`)
                params.push( typeof datum === 'object' ? datum.value : datum )
            }
        } )

        where = paramCtr > 1 ? `WHERE ${whereList.join(' AND ')}` : ''
        joins = joins.join(' ')
        selects = Object.keys( selects ).map( tableName => this._getColumns( tableName, { extend: joins.length } ) ).join(', ')

        return this.Postgres.query( `SELECT ${selects} FROM "${name}" ${joins} ${where}`, params )
    },

    PATCH( resource ) { 
        var paramCtr = 1,
            name = resource.path[0],
            bodyKeys = Object.keys( resource.body ),
            set = 'SET ' + bodyKeys.map( key => `"${key}" = $${paramCtr++}` ).join(', ')

        return this.Postgres.query(
            `UPDATE "${name}" ${set} WHERE id = $${paramCtr} RETURNING ${this._getColumns(name)}`,
            bodyKeys.map( key => resource.body[key] ).concat( resource.path[1] ) )
    },

    POST( resource ) {
        return this.Postgres.insert( resource.path[0], resource.body )
        /*
        const bodyKeys = Object.keys( resource.body ),
              name = resource.path[0],
              columns = bodyKeys.map( key => this.Postgres.tables[ name ].columns.find( column => column.name === key ) )

        return this.Postgres.query(
            `INSERT INTO "${name}" ( ${this._wrapKeys(bodyKeys)} ) VALUES ( ${ this._getValues( bodyKeys, columns ) } ) RETURNING ${this._getColumns(name, { columnOnly: true } )}`,
            this._getParameters( bodyKeys, resource.body, columns )
        )
        */
    },

    _getColumns( name, opts={} ) {
        return this.Postgres.tables[ name ].columns.map( column => {
            let rv = opts.columnOnly ? `"${column.name}"` : `"${name}"."${column.name}"`
            if( opts.extend ) rv += ` as "${name}.${column.name}"`
            return rv
        } ).join(', ')
    },

    _getValues( keys, columns ) {
        let varIdx = 1
        return keys.map( ( key, i ) => {
            return columns[i].range === 'Geography'
                ? `ST_Makepoint( $${varIdx++}, $${varIdx++} )`
                : `$${varIdx++}`
        } ).join(', ')
    },

    _getParameters( keys, body, columns ) {
        return keys.reduce( ( memo, key, i ) =>
            memo = memo.concat(
                columns[i].range === 'Geography'
                    ? [ body[ key ][0], body[ key ][1] ]
                    : body[ key ]
            ),
        [ ] )
    },

    _validOperations: new Set( [ '<', '>', '<=', '>=', '=', '<>', '!=', '~*', 'join', 'leftJoin' ] ),

    _wrapKeys: keys => keys.map( key => `"${key}"` ).join(', ')

}, { } )
