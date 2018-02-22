module.exports = Object.assign( {}, require('./__proto__'), {

    AutoComplete: require('./lib/AutoComplete'),

    Resources: {

        Byop: {
            Model: require('../models/Byop'),
            renderItem: ( item, search ) => {
                const value = `${item.name1}, ${item.name2}`
                return `<div class="autocomplete-suggestion" data-val="${value}" data-id="${item.id}">${value}</div>` },
            search( term, suggest ) {
                return Promise.all( [
                    this.Xhr( { method: 'get', qs: this.getQs( 'name1', term ), resource: 'byop' } ),
                    this.Xhr( { method: 'get', qs: this.getQs('name2', term ), resource: 'byop' } )
                ] )
                .then( ( [ name1Data, name2Data ] ) => {
                    if( name1Data.length === 0 && name2Data.length === 0 ) return Promise.resolve( false )
                
                    name2Data = name2Data.filter( datum2 => name1Data.find( datum1 => datum1.id == datum2.id ) === undefined )
                    
                    this.resource.Model.constructor( name1Data.concat( name2Data ), { storeBy: [ 'id' ] } )
                    suggest( this.resource.Model.data )
                    return Promise.resolve( true )
                } )
            }
        },

        Document: {
            Model: Object.assign( { }, require('../models/Document') ),
            renderItem: ( item, search ) => `<div class="autocomplete-suggestion" data-val="${item.label}" data-id="${item._id}">${item.label}</div>`,
            search( term, suggest ) {
                return this.Xhr( { method: 'get', qs: JSON.stringify( { label: { '$regex': term, '$options': 'i' } } ), resource: this.Resource } )
                .then( documents => {
                    if( ! Array.isArray( documents ) ) documents = [ documents ]
                    if( documents.length === 0 ) return Promise.resolve( false )
                
                    this.resource.Model.constructor( documents, { storeBy: [ '_id' ] } )
                    suggest( this.resource.Model.data )
                    return Promise.resolve( true )
                } )
            }
        }
    },

    clear( suppressEmit ) {
        this.els.input.value = ''
        if( !suppressEmit ) this.emit('cleared')
    },

    events: {
        input: 'input'
    },
    
    focus() { this.els.input.focus() },

    getSelectedId() {
        if( !this.selectedModel ) return undefined

        return this.selectedModel._id || this.selectedModel.id
    },

    getQs( attr, term ) {
        return JSON.stringify( Object.assign( {}, { [ attr ]: { operation: '~*', value: term } } ) )
    },

    initAutoComplete( initialId, defaultName ) {
        const queryAttr = initialId
            ? { id: initialId }
            : defaultName ? { name: defaultName } : undefined

        new this.AutoComplete( {
            delay: 500,
            selector: this.els.input,
            minChars: 1,
            cache: false,
            renderItem: this.resource.renderItem,
            source: ( term, suggest ) => {
                Reflect.apply( this.resource.search, this, [ term.trim(), suggest ] )
                .then( found => found ? Promise.resolve(true) : suggest([]) )
                .catch( this.Error )
            },
            onSelect: ( e, term, item ) => {
                const store = this.resource.Model.store;
                this.selectedModel = ( store.id ? store.id : store['_id'] )[ item.getAttribute( 'data-id' ) ]
                this.emit( 'itemSelected', this.selectedModel )
            }
        } )

        if( queryAttr ) {
            this.Xhr( Object.assign ( { resource: this.Resource }, queryAttr ) )
            .then( document => {
                document = Array.isArray( document ) ? document[0] : document
                this.selectedModel = document
                this.els.input.value = document.label
                return Promise.resolve()
            } )
            .catch( this.Error )
        }
    },

    onInputInput() {
        if( this.els.input.value.trim() === "" ) this.emit('cleared')
    },

    postRender() {
        this.Resource = this.Resource
        this.Type = this.Type
        this.resource = this.Resources[ this.Type ]
       
        if( this.resource && this.Resource ) this.initAutoComplete()
        
        return this
    },

    setResource( resource ) {
        this.Resource = resource
        this.resource = this.Resources[ this.Type ]
        return this
    }
} )
