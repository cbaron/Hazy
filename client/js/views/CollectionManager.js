module.exports = Object.assign( { }, require('./__proto__'), {

    model: require('../models/CollectionManager'),
    Collection: require('../models/Collection'),
    DocumentModel: require('../models/Document'),
    JsonPropertyModel: require('../models/JsonProperty'),

    Views: {

        collections() {
            return {
                events: {
                    list: 'click'
                },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Collection ),
                    delete: true,
                    droppable: 'document',
                    fetch: true
                } ),
                itemTemplate: collection => `<span>${collection.name}</span>`,
                templateOptions: { heading: 'Collections', name: 'Collections', toggle: true }
            }
        },

        createCollection() {
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.Collection ).constructor(),
                templateOptions: { heading: 'Create Collection' }
            }
        },

        deleteCollection( model ) {
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.Collection ).constructor( model ),
                templateOptions: { message: `Delete '${model.name}' Collection?` }
            }
        },

        deleteDocument( document ) {
            return {
                insertion: { el: this.els.mainPanel },
                model: Object.create( this.DocumentModel ).constructor( document, { resource: this.model.git('currentCollection') } ),
                templateOptions: { message: `Delete '${document.label}' ${this.model.git('currentCollection')}?` }
            }
        },

        documentList() {
            return {
                model: Object.create( this.Model ).constructor( {
                    add: true,
                    collection: Object.create( this.DocumentModel ).constructor( [ ], { resource: this.model.git('currentCollection') } ),
                    delete: true,
                    draggable: 'document',
                    pageSize: 100,
                    skip: 0,
                    sort: { 'label': 1 }
                } ),
                events: { list: 'click' },
                insertion: { el: this.els.mainPanel },
                itemTemplate: this.Templates.Document
            }
        },

        documentView() {
            return {
                model: Object.create( this.Model ).constructor( {
                    add: true,
                    collection: Object.create( this.DocumentModel ).constructor( [], { model: this.JsonPropertyModel, meta: { key: 'key' } } ),
                    reset: true,
                    save: true,
                    view: 'jsonProperty'
                } ),
            }
        }
    },
                
    Templates: {
        Document: require('./templates/Document')
    },

    getDocument( collection, documentName ) {
        return Object.create( this.Model ).constructor( {}, { resource: this.path[0] } ).get( { query: { name: this.path[1] } } )
    },
    
    onDocumentSave( keyValuePairs ) {
        const doc = Object.create( this.DocumentModel ).constructor( keyValuePairs, { resource: this.model.git('currentCollection') } ).toObj()
        
        if( doc.git('_id') ) {
            doc.put( doc.git('_id'), this.omit( doc.data, [ '_id' ] ) )
            .then( () => {
                this.Toast.showMessage( 'success', `${doc.git('label')} updated.` )
                return this.clearCurrentView()
            } )
            .then( () => this.views.documentList.fetched ? this.views.documentList.updateItem( doc ) : this.views.documentList.fetch() )
            .then( () => this.views.documentList.show() )
            .then( () => {
                this.model.set( 'currentView', 'documentList' )
                this.emit( 'navigate', '', { up: true, silent: true } )
                return Promise.resolve()
            } )
            .catch( e => { this.Error(e); this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) } )
        } else {
            if( !doc.git('name') || !doc.git('label') ) return this.Toast.showMessage( 'error', `'name', 'label' required` )

            doc.post( doc.data )
            .then( () => {
                this.Toast.showMessage( 'success', `${doc.git('label')} created.` )
                return this.clearCurrentView()
            } )
            .then( () => { this.views.documentList.add( doc.data, true ); return this.views.documentList.show() } )
            .then( () => {
                this.model.set( 'currentView', 'documentList' )
                this.emit( 'navigate', '', { up: true, silent: true } )
                return Promise.resolve()
            } )
            .catch( e => { this.Error(e); this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) } )
        }
    },

    clearCurrentView() {
        const currentView = this.model.git('currentView');
        return ( currentView !== 'documentList' && currentView !== 'documentView'
            ? this.views[ currentView ].delete( { silent: true } )
            : this.views[ currentView ].hide()
        )
    },

    createDocumentList( collectionName, fetch=true ) {
        this.model.set( 'currentCollection', collectionName )
        this.createView( 'list', 'documentList' )
        if( fetch ) { this.views.documentList.fetch().catch(this.Error) } else { this.views.documentList.hideSync() }
        this.views.documentList.getCount().then( count => this.updateCount(count) ).catch(this.Error)
        this.Header.enableTypeAhead( { Type: 'Document', Resource: collectionName, templateOptions: { placeholder: `Search ${collectionName} collection.` } }, document => this.onDocumentSelected(document) )
        return this.views.collections.unhideItems().hideItems( [ this.model.git('currentCollection') ] )
    },

    createView( type, name, model ) {
        this.views[ name ] = this.factory.create( type, Reflect.apply( this.Views[ name ], this, [ model ] ) )

        if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
        this.model.set( 'currentView', name )
    },

    events: {
        createCollectionBtn: 'click',
        resource: 'click',

        views: {
            collections: [
                [ 'deleteClicked',
                  function( collection ) {
                      this.clearCurrentView()
                      .then( () => Promise.resolve( this.createView( 'deleter', 'deleteCollection', collection ) ) )
                      .catch( this.Error )
                  }
                ],
                [ 'fetched', function() { this.views.collections.hideItems( [ this.model.git('currentCollection') ] ) } ],
                [ 'itemClicked', function( model ) {
                    this.clearCurrentView()
                    .then( () => this.views.documentList.delete() )
                    .then( () => this.createDocumentList( model.name ) )
                    .then( () => {
                        this.emit( 'navigate', model.name, { silent: true, replace: true } )
                        return Promise.resolve()
                    } )
                    .catch( this.Error )
                } ]
            ],
            createCollection: [
                [ 'deleted', function() {
                    this.model.set( 'currentView', 'documentList' )
                    this.views.documentList.show().catch(this.Error)
                } ],
                [ 'posted', function( collection ) { this.views.collections.add( collection ) } ]
            ],
            deleteCollection: [
                [ 'deleted', function() { this.model.set('currentView', 'documentList' ); this.views.documentList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.collections.remove( model ) } ]
            ],
            deleteDocument: [
                [ 'deleted', function() { this.model.set('currentView', 'documentList' ); this.views.documentList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.documentList.remove( model ) } ]
            ],
            documentList: [
                [ 'addClicked', function() {
                    this.clearCurrentView()
                    .then( () => {
                        this.model.set( 'currentView', 'documentView' )
                        this.emit( 'navigate', 'new-document', { append: true, silent: true } )
                        this.path.push('new-document')
                        return this.views.documentView.update( [ this.JsonPropertyModel.CreateDefault() ] ).show()
                    } )
                    .catch( this.Error )
                  }
                ],
                [ 'itemClicked', function( document ) { this.onDocumentSelected( document ) } ],
                [ 'dragStart', function( type ) { this.views.collections.showDroppable( type ) } ],
                [ 'dropped', function( data ) { this.views.collections.hideDroppable(); this.views.collections.checkDrop( data ) } ],
                [ 'deleteClicked',
                  function( document ) { 
                    this.clearCurrentView()
                    .then( () => Promise.resolve( this.createView( 'deleter', 'deleteDocument', document ) ) )
                    .catch( this.Error )
                  }
                ]
            ],
            documentView: [
                [ 'saveClicked', function( document ) { this.onDocumentSave( document ) } ],
                [ 'resetClicked', function() {
                    if( this.path[1] === 'new-document' ) return this.emit( 'navigate', '', { up: true } )
                    this.getDocument().then( document => Promise.resolve( this.views.documentView.update( this.DocumentModel.toList( document ) ) ) ).catch(this.Error)
                } ],
                [ 'goBackClicked', function( model ) { this.emit( 'navigate', `/admin/${this.model.git('currentCollection')}` ) } ]
            ]
        }
    },

    onCreateCollectionBtnClick() {
        this.clearCurrentView()
        .then( () => Promise.resolve( this.createView( 'form', 'createCollection' ) ) )
        .catch( this.Error )
    },

    onDocumentSelected( document ) {
        return this.clearCurrentView()
        .then( () => this.showDocumentView( document ) )
        .catch( this.Error )
    },

    onNavigation( path ) {

        this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => this.clearCurrentView() )
        .then( () => this.showProperView( false ) )
        .catch( this.Error ) 
    },

    onResourceClick() {
        if( this.model.git('currentView') === 'documentList' ) return

        this.clearCurrentView()
        .then( () => {
            if( this.path.length === 2 ) {
                this.emit( 'navigate', '', { up: true, silent: true } )
                this.path.pop()
            }
            this.model.set('currentView', 'documentList')
            return this.showProperView()
        } )
        .catch( this.Error )
    },

    postRender() {

        if( this.path.length > 0 ) this.model.set( 'currentCollection', this.path[0] )

        this.showProperView( true ).catch( this.Error )

        return this
    },

    showDocumentView( document, emit=true ) {
        return this.views.documentView.update( this.DocumentModel.toList( document ) ).show()
        .then( () => {
            if( emit ) this.emit( 'navigate', document.name, Object.assign( { silent: true }, this.model.git( 'currentView' ) === 'documentView' ? { replace: true } : { append: true } ) );
            this.model.set('currentView', 'documentView' );
            return Promise.resolve()
        } )
    },

    showProperView( isInit ) {
        this.model.set( 'currentView', this.path.length === 2 ? 'documentView' : 'documentList' )
        if( this.path.length === 0 ) this.emit( 'navigate', this.model.git('currentCollection'), { append: true, silent: true } )

        return (this.views.documentList ? this.views.documentList.delete() : Promise.resolve() )
        .then( () => this.createDocumentList( this.model.git('currentCollection'), this.path.length === 2 ? false : true ) )
        .then( () =>
            this.path.length === 2
                ? this.getDocument()
                  .then( document =>
                  Array.isArray( document )
                      ? Promise.resolve( this.emit( 'navigate', '', { up: true } ) )
                      : this.showDocumentView( document, false )
                  )
            : this.views.documentList.show()
        )
    },

    updateCount( count ) {
        this.els.resource.textContent = `${this.model.git('currentCollection')} (${count})`
    }

} )
