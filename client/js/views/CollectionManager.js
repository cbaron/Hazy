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
                model: Object.create( this.DocumentModel ).constructor( model ),
                templateOptions: { message: `Delete '${model.label}' ${this.model.git('currentCollection')}?` }
            }
        },

        documentList() {
            return {
                model: Object.create( this.Model ).constructor( {
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
                    view: 'jsonProperty',
                    reset: true,
                    save: true
                } ),
            }
        }
    },
                
    Templates: {
        Document: require('./templates/Document')
    },

    getDocument( collection, documentName ) {
        return Object.create( this.Model ).constructor( {}, { resource: collection } ).get( { query: { name: documentName } } )
    },
    
    onDocumentSave( model ) {
        const obj = model.toObj()
       
        this.documentList.put( obj._id, this.omit( obj, [ '_id' ] ) )
        .then( () => this.Toast.showMessage( 'success', `${this.model.git('currentCollection')} updated.` ) )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) } )
    },

    clearCurrentView() {
        const currentView = this.model.git('currentView');
        return ( currentView !== 'documentList'
            ? this.views[ currentView ].delete( { silent: true } )
            : Promise.all( [ this.views[ currentView ].hide(), this.hideEl( this.els.addButton ) ] )
        )
    },

    createDocumentList( collectionName ) {
        this.model.set( 'currentCollection', collectionName )
        this.createView( 'list', 'documentList' )
        this.views.documentList.fetch()
        this.Header.enableTypeAhead( { Type: 'Document', Resource: collectionName, placeholder: `Search ${collectionName} collection.` }, document => this.onDocumentSelected(document) )
        return this.views.collections.unhideItems().hideItems( [ this.model.git('currentCollection') ] )
    },

    createView( type, name, model ) {
        this.views[ name ] = this.factory.create( type, Reflect.apply( this.Views[ name ], this, [ model ] ) )

        if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
        this.model.set( 'currentView', name )
    },

    events: {
        addButton: 'click',
        createCollectionBtn: 'click',
        goBackBtn: 'click',

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
                    console.log('TT')
                    this.model.set( 'currentView', 'documentList' )
                    Promise.all( [ this.views.documentList.show(), this.showEl( this.els.addButton ) ] ).catch(this.Error)
                } ],
                [ 'posted', function( collection ) { this.views.collections.add( collection ) } ]
            ],
            deleteCollection: [
                [ 'deleted', function() { this.currentView = 'documentList'; this.views.documentList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.collections.remove( model ) } ]
            ],
            deleteDocument: [
                [ 'deleted', function() { this.currentView = 'documentList'; this.views.documentList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.documentList.remove( model ) } ]
            ],
            documentList: [
                [ 'itemClicked', function( document ) { this.onDocumentSelected( item ) } ],
                [ 'dragStart', function( type ) { this.views.collections.showDroppable( type ) } ],
                [ 'dropped', function( data ) { this.views.collections.hideDroppable(); this.views.collections.checkDrop( data ) } ],
                [ 'deleteClicked',
                  function( document ) { 
                    this.views.discTypesList.hide()
                    .then( () => Promise.resolve( this.createView( 'deleter', 'deleteDocument', document ) ) )
                    .catch( this.Error )
                  }
                ]
            ],
            documentView: [
                [ 'savedClick', function( document ) { this.onDocumentSave( document ) } ],
                [ 'resetClicked', function( model ) { this.views.documentView.update( this.DocumentModel.toList() ) } ],
                [ 'goBackClicked', function( model ) { this.emit( 'navigate', `/admin/${this.model.git('currentCollection')}` ) } ]
            ]
        }
    },

    onAddButtonClick() {
        this.views.discTypeJson.add( { key: 'new key', value: 'new value' } )
        return
        const time = new Date().getTime()
        this.slurpTemplate( { template: this.Templates.Key( time, 'new-attribute', true ), insertion: { el: this.els.data } } )
        this.views[ time ] =
            this.factory.create( 'literal', { model: { data: 'new-value', meta: { editable: true } }, insertion: { el: this.els[time] } } )

        this.els[ time ].firstChild.focus()
    },

    onCreateCollectionBtnClick() {
        this.clearCurrentView()
        .then( () => Promise.resolve( this.createView( 'form', 'createCollection' ) ) )
        .catch( this.Error )
    },

    onGoBackBtnClick() {
        this.emit( 'navigate', '/admin' )
    },

    onDocumentSelected( document ) {
        return this.clearCurrentView()
        .then( () => this.showDocumentView( document ) )
        .catch( this.Error )
        
        this.path = [ `collection-manager`, item.name ]

        this.views.discTypesList.hide()
        .then( () => {
            this.views.discTypeJson.update( this.discType.toList( item ) )
            return this.views.discTypeJson.show()
        } )
        .catch( this.Error )
    },

    onNavigation( path ) {

        this.path = path

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => {
            const nextView = this.path.length === 3 ? 'documentView' : 'documentList';
            if( this.model.git('currentView') === nextView ) return Promise.resolve()
            return ( this.model.git('currentView') ? this.views[ this.this.model.git('currentView') ].hide() : Promise.resolve() )
            .then( () => {
                this.model.set('currentView', nextView )
                return this.views[ nextView ].show()
            } )
        } )
        .then( () =>
            this.path.length === 1 
                ? this.emit( 'navigate', this.model.git('currentCollection'), { append: true, silent: true } )
                : Promise.resolve()
        )
        .catch( this.Error ) 

        if( this.isHidden() ) this.showSync()

        if( this.path.length === 3 ) { 
            this.views.documentView.fetch( { query: { name: this.path[1] } } )
            .then( () =>
                this.views.documentView.collection.length === 0 
                    ? Promise.resolve( this.emit( 'navigate', '/admin/collection-manager' ) )
                    : this.views.documentView.show()
            )
            .catch( this.Error )
        } else {
            this.views.documentList.show().catch( this.Error )
        } 
    },

    postRender() {

        if( this.path.length === 2 ) this.views.documentList.fetch().then( () => this.views.documentList.show() ).catch( this.Error )
        else if( this.path.length === 3 ) {
            this.getDocument( this.path[1], this.path[2] )
            .then( documents =>
                documents.length !== 1 
                    ? Promise.resolve( this.emit( 'navigate', '', { up: true } ) )
                    : this.showDocumentView( documents[0], false )
            )
            .catch( this.Error )
        }

        //this.documentList = Object.create( this.DocumentModel ).constructor( [ ], { resource: this.model.git('currentCollection') } )

        //this.discType = Object.create( this.DiscType )

        this.views.documentList.getCount().then( count => this.updateCount(count) )   

        /* 
        this.discType.getCount()
        .then( () => Promise.resolve( this.updateCount() ) )
        .catch( this.Error )
        */

        /*
        this.views.discTypesList.on( 'itemDblClicked', item => this.onItemSelected( item ) )
        this.views.discTypesList.on( 'dragStart', type => this.views.collections.showDroppable( type ) )
        this.views.discTypesList.on( 'dropped', data => {
            this.views.collections.hideDroppable()
            this.views.collections.checkDrop( data )
        } )
        */
        
        //this.views.discTypeJson.els.container.classList.add('hidden')
    
        /*     
        this.views.discTypeJson.on( 'saveClicked', model => {
            const obj = model.toObj()
            this.discType.put( obj._id, this.omit( obj, [ '_id' ] ) )
            .then( () => this.Toast.showMessage( 'success', 'Disc Type updated.' ) )
            .catch( e => this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) )
        } )
        
        this.views.discTypeJson.on( 'resetClicked', model => this.views.discTypeJson.update( this.discType.toList() ) )
        
        this.views.discTypeJson.on( 'goBackClicked', () => this.emit( 'navigate', '/admin/manage-disc-types' ) )
        */

        /*
        this.views.collections.on( 'posted', name => this.views.collections.add( posted ) )

        this.views.collections.on( 'deleteClicked', model => {
            this.views[ this.currentView ].hide()
            .then( () => Promise.resolve( this.createView( 'deleter', 'deleteCollection', model ) ) )
            .catch( this.Error )
        } )
        */

        /*
        this.views.discTypesList.on( 'deleteClicked', model =>
            this.views.discTypesList.hide()
            .then( () => Promise.resolve( this.createView( 'deleter', 'deleteDiscType', model ) ) )
            .catch( this.Error )
        )
        */


        return this
    },

    showDocumentView( document, emit=true ) {
        return this.views.documentView.update( this.DocumentModel.toList( document ).map( keyValuePair => Object.create( this.JsonPropertyModel ).constructor( keyValuePair ) ) ).show()
        .then( () => {
            if( emit ) this.emit( 'navigate', document.name, Object.assign( { silent: true }, this.model.git( 'currentView' ) === 'documentView' ? { replace: true } : { append: true } ) );
            this.model.set('currentView', 'documentView' );
            return Promise.resolve()
        } )
    },

    updateCount( count ) {
        this.els.resource.textContent = `${this.model.git('currentCollection')} (${count})`
    },

    

} )
