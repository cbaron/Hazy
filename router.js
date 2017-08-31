module.exports = Object.create( Object.assign( {}, require('./lib/MyObject'), {

    Fs: require('fs'),

    Mongo: require('./dal/Mongo'),

    Path: require('path'),
    
    Postgres: require('./dal/Postgres'),

    handler( request, response ) {
        const path = request.url.split('/').slice(1)
            
         if( /favicon/.test( path.join('') ) ) { response.writeHead( 301, { 'Location': `${process.env.STORAGE_URL}tree.png` } ); return response.end("") }

        let lastPath = path[ path.length - 1 ],
            queryIndex = lastPath.indexOf('?'),
            qs = ''

        if( queryIndex !== -1 ) {
            qs = lastPath.slice( queryIndex + 1 )
            path[ path.length - 1 ] = lastPath.slice( 0, queryIndex )
        }

        request.setEncoding('utf8');

        ( path[0] === "static"
            ? this.static( request, response, path )
            : ( /application\/json/.test( request.headers.accept ) || ( request.method === "GET" && path[0] === "report" )  )
                ? this.rest( request, response, path, qs )
                : this.html( request, response )
        )
        .catch( e => {
            if( e.message !== "Handled" ) {
                this.Error(e)
                response.writeHead( 500, { 'Content-Length': 0, 'Content-Type': 'text/plain' } )
                response.end()
            }
        } )
    },

    html( request, response ) {
        response.writeHead( 200 )
        response.end( require('./templates/page')( { isDev: this.isDev, request,  title: process.env.NAME } ) )
        return Promise.resolve()
    },

    initialize() {

        this.jsonRoutes = {}

        return Promise.all( [
            this.Mongo.initialize(),
            this.Postgres.initialize(),
            this.P( this.Fs.readdir, [ `${__dirname}/resources` ] )
        ] )
        .then( ( [ a, b, [ files ] ] ) => {
            const fileHash =
                files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
                .reduce( ( memo, name ) => Object.assign( memo, { [name.replace('.js','')]: true } ), { } )

            this.Postgres.tableNames.forEach( table => this.jsonRoutes[ table ] = fileHash[ table ] ? table : '__proto__' )
            this.Mongo.collectionNames.forEach( table => this.jsonRoutes[ table ] = fileHash[ table ] ? table : '__proto__' )
            
            Object.keys( fileHash )
                .filter( name => (!this.Postgres.tableNames[ name ]) && (!this.Mongo.collectionNames[ name ]) )
                .forEach( name => this.jsonRoutes[ name ] = name )

            return Promise.resolve() 
        } )
    },

    rest( request, response, path, qs ) {
        const file = this.jsonRoutes[ path[0] ]

        if( !file ) {
            response.writeHead( 404, { 'Content-Length': 0, 'Content-Type': 'text/plain' } )
            return Promise.resolve( response.end() )
        }
        
        return Object.create( require(`./resources/${file}`), {
            request: { value: request },
            response: { value: response },
            path: { value: path },
            qs: { value: qs },
        } ).apply( request.method )
    },

    static( request, response, path ) {
        var fileName = path.pop(),
            filePath = `${__dirname}/${path.join('/')}/${fileName}`,
            ext = this.Path.extname( filePath )

        return this.P( this.Fs.stat, [ filePath ] )
        .then( ( [ stat ] ) => new Promise( ( resolve, reject ) => {
            
            var stream = this.Fs.createReadStream( filePath )
            
            response.on( 'error', e => { stream.end(); reject(e) } )
            stream.on( 'error', reject )
            stream.on( 'end', () => {
                response.end();
                resolve()
            } )

            response.writeHead(
                200,
                {
                    'Cache-Control': process.env.NODE_ENV === 'development' ? `no-cache` : `max-age=600`,
                    'Connection': 'keep-alive',
                    'Content-Encoding': ext === ".gz" ? 'gzip' : 'identity',
                    'Content-Length': stat.size,
                    'Content-Type':
                        /\.css/.test(fileName)
                            ? 'text/css'
                            : ext === '.svg'
                                ? 'image/svg+xml'
                                : ext === '.pdf'
                                    ? 'application/pdf'
                                    : 'text/plain'
                }
            )
            stream.pipe( response, { end: false } )
        } ) )
    }

} ), { isDev: { value: process.env.NODE_ENV === 'development' } } )
