# Library

Some information on ./lib/

## Auth
  Copied from `LetsTwinkle` project.  To be integrated into `./resources/auth.js`
  
  exports: `singleton`
  
  #### createPassword
  Given a string, createPassword returns a "hashed" version of the password using npm's `bccypt` module
  ```sh
    Auth.createPassword( password ) -> returns Promise( hashedPassword )
  ```
  
  #### getToken
  Given a JSON object, getToken returns a JSON web token.
  ```sh
    Auth.getToken( obj ) -> returns Promise( Jwt )
  ```
  
  #### parseCookies
  Given the `cookie` request header, returns the cookie value for the application cookie defined in `process.env.COOKIE`.
  ```sh
    Auth.parseCookies( cookies ) -> returns $cookieValue
  ```
  
## ColumnFixture
  Copied from `LetsTwinkle` project.  Used to create fake data for a given Postgres column.  Will be used to integrate JSON properties for use in Mongo.
  
  exports: `factory function`
  
  #### factory
  Given a postgres column { fk: { table, column, recordType }, isEnum, isNullable, maximumCharacterLength, name, range }, and optional options { headers }, the factory returns a valid value to use in a Postgres column.
  ```sh
    ColumnFixture( this.Postgres.tables[ 'tablename' ].model.store.name[ 'columnname' ] ) -> returns Promise( value )
  ```
  
## Enum
  Copied subset from `LetsTwinkle` project.  More like a "UserDefinedDataType".  Currently, this is used in the application to validate data as well as generated random data as it relates to a value in a Postgres column.  See [Postgres](../dal/README.md) or [ColumnFixture source](./ColumnFixture.js)
  
  exports: `JSON object`
  
  ## Model
  This file should be moved to `models/__proto__/js` in order to act as properties and methods to be inherited by all model instances.
  
  exports: `JSON object`
  
  #### attributes
  Should be changed to an empty array.  A list of potential attributes on the model.  Generally used to hold metadata about the attributes ( { name, label, range } )
  ```sh
    attributes: [
      {
        name: 'name',
        label: 'Name',
        Range: 'Text',
        error: 'Please enter a name with no spaces.',
        validate: val => val.trim() !== '' && !/\s/.test(val),
        metadata: { }
      }
    ] 
  ```
  
  #### data
  The raw model data, can be a list or object.
  
  #### constructor
  Used to populate the model with data and options.  The storeBy option will place model objects which hold array data into a hash using the storeBy values as the hash key.  The hash is assigned to the `store` attribute.
  ```sh
    const model = Object.create( someModelObject ).constructor( [ { name: 'DiscType' } ], storeBy: [ 'name' ] )
    
    Model.store.name[ 'DiscType' ] == { name: 'DiscType' }
  ```
  
  #### meta
  Holds information about the model.  Currently `sort`, and `key` are used on the client.
  
## MyError
  Error logger.  To be used if/when more configuration is needed in this area.  Mostly used currently to log a caught exception.
  
  exports: `factory function`
  
  #### factory
  ```sh
    someFn() { return somePromise.catch( MyError ) }
  ```

## MyObject
  The mother / father of objects.  Should eventually factor out a few methods here.  Generally used by other object definitions as a base object.
  
  exports: `JSON object`
  
  #### capitalizeFirstLetter
  Capitalizes first letter in a string.  A helper method used in some of my patterns.  Should probably be phased out.
  ```sh
    MyObj.capitalizeFirstLetter('someView') -> returns 'SomeView'
  ```
 
 #### getIntRange
  Used to get an array of length `n`.  Generally used in `LetsTwinkle` project for data bootstrapping.
  ```sh
    MyObj.getIntRange( 3 ) -> returns [ 0, 1, 2 ]
  ```
  
  #### getRandomInclusiveInteger
  Used to get a random inclusive Integer.  Generally used in `LetsTwinkle` project for data bootstrapping.
  ```sh
    MyObj.getRandomInclusiveInteger( 0, 3 ) -> returns 0 | 1 | 2 | 3
  ```
 
 #### omit
  Used to remove a list of properties on a JSON object ( see underscore )
  ```sh
    MyObj.omit( { a: 'b' }, [ 'a' ] ) -> returns { }
  ```
  
  #### pick
  Used to get a list of properties on a JSON object ( see underscore )
  ```sh
    MyObj.pick( { a: 'b' }, [ 'a' ] ) -> returns { a: 'b' }
  ```

  #### reducer
  Turns an array into an object by applying a passed in function to each array item.  The return values for each iteration are accumulated via `[].reduce`.
  ```sh
    MyObj.reducer( someArr, datum => ( { [ datum.key ]: datum.value } ) ) -> returns SomeJsonObject
  ```
  
  #### shuffleArray
  Given an array, shuffleArray returns a new array with items from the passed in array in a random order.  Useful for testing.
  ```sh
    MyObj.shuffleArray( [ 0, 1 ] ) -> returns [ 0, 1 ] || [ 1, 0 ]
  ```
  #### Error
  Reference to the MyError factory
  ```sh
    SomePromise.catch( MyObj.Error ) -> logs caught exception
  ```
  
  #### P
  Intended to reduce "callback hell".  A common attack on javascript:
  ```sh
    doAsyncThing( param1, param2, function( err, asyncResult ) {
        if( err ) return handleErr(err)
        doAnotherAsyncThing( asyncResult, function( errTwo, asyncResultTwo ) {
           if( errTwo ) return handleErr( errTwo )
  ```
  can be transformed into:
  ```sh
    MyObj.P( doAsyncThing [ param1, param2 ] )
    .then( result => MyObj.P( doAnotherAsyncThing, [ result ] ) )
    .catch( handleErr )
  ```
  #### constructor
  Intended to do something.  Doesn't.  Should probably move toward Classes.

## Request
  Factory method for making http(s) requests.
  
  exports: `factory function`
  
  #### factory
  Makes an http(s) request.  Returns a promise.  Content-Length will automatically be sent for requests with a payload.  When `streamIn` is false, successfully resolves `[ parsedResponseBody, http.IncomingMessage ( node class ) ]`
  ```sh
    Request( {
        agent: http.agent || Boolean ( optional, see [node](https://nodejs.org/api/http.html#http_http_request_options_callback) documentation ),
        contentType: content type header ( default: 'application/json' )
        headers: headers ( default: { accept: 'application/json' } ),
        hostname: hostname ( default node's `http.request` default )
        method: request method ( default: 'GET' )
        path: this.opts.path,
        port: port ( default: process.env.PORT ),
        protocol: 'https' || 'http'(default),
        streamIn: Boolean, (when true this method will resolve with the `http.IncomingMessage` without doing any parsing.  Useful for streaming file responses,
        streamOut: WriteStream, when used the request payload will be streamed using the WriteStream.pipe method.  See [node](https://nodejs.org/api/stream.html#stream_writable_streams)
    } )
  ```


License
----
MIT

