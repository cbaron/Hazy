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


License
----
MIT

