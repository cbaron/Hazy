module.exports = Object.assign( { }, require('./__proto__'), {

    model: require('../models/CollectionManager'),
    Collection: require('../models/Collection'),
    DocumentModel: require('../models/Document'),

    Views: {

        collections() {
            return {
                model: Object.create( this.Model ).constructor( { delete: true, droppable: 'document', fetch: true } ),
                events: { list: 'click' },
                collection: Object.create( this.Collection ),
                itemTemplate: collection => `<span>${collection.name}</span>`,
                templateOptions: { heading: 'Collections', name: 'Collections', toggle: true }
            }
        },

        createCollection() {
            return {
                insertion: { el: this.els.container },
                model: Object.create( this.Collection ).constructor(),
                templateOptions: { heading: 'Create Collection' }
            }
        },

        deleteCollection( model ) {
            return {
                insertion: { el: this.els.container },
                model: Object.create( this.Collection ).constructor( model ),
                templateOptions: { message: `Delete '${model.name}' Collection?` }
            }
        },

        deleteDiscType( model ) {
            return {
                insertion: { el: this.els.container },
                model: Object.create( this.DiscType ).constructor( model ),
                templateOptions: { message: `Delete '${model.name}' Disc Type?` }
            }
        },

        documentList() {
            return {
                model: Object.create( this.Model ).constructor( { delete: true, draggable: 'document', fetch: true } ),
                events: { list: 'click' },
                itemTemplate: this.Templates.DiscType,
                collection: Object.create( this.DiscType ),
                templateOptions: { heading: 'Disc Types', name: 'DiscTypes' },
            }
        },

        documentView() {
            return {
                model: Object.create( this.Model ).constructor( { reset: true, save: true } ),
                item: 'jsonProperty',
                templateOptions: { goBack: 'Back to Disc Types', heading: 'Disc Type' },
                collection: require('../models/JsonProperty')
            }
        }
    },
                
    Templates: {
        DiscType: require('./templates/DiscType')
    },

    onDocumentSave( model ) {
        const obj = model.toObj()
       
        this.documentList.put( obj._id, this.omit( obj, [ '_id' ] ) )
        .then( () => this.Toast.showMessage( 'success', `${this.model.git('currentCollection')} updated.` ) )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) } )
    },

    createView( type, name, model ) {
        this.views[ name ] = this.factory.create( type, Reflect.apply( this.Views[ name ], this, [ model ] ) )

        if( this.events.views[ name ] ) this.events.views[ name ].forEach( arr => this.views[ name ].on( arr[0], eventData => Reflect.apply( arr[1], this, [ eventData ] ) ) )
        this.currentView = name
    },

    events: {
        addButton: 'click',
        createCollectionBtn: 'click',
        goBackBtn: 'click',

        views: {
            createCollection: [
                [ 'posted', function( collection ) { this.views.collections.add( collection ) } ]
            ],
            deleteCollection: [
                [ 'deleted', function() { this.currentView = 'discTypesList'; this.views.discTypesList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.collections.remove( model ) } ]
            ],
            deleteDiscType: [
                [ 'deleted', function() { this.currentView = 'discTypesList'; this.views.discTypesList.show().catch(this.Error) } ],
                [ 'modelDeleted', function( model ) { this.views.discTypesList.remove( model ) } ]
            ],
            documentList: [
                [ 'itemDblClicked', function( item ) { this.onItemSelected( item ) } ],
                [ 'dragStart', function( type ) { this.views.collections.showDroppable( type ) } ],
                [ 'dropped', function( data ) { this.views.collections.hideDroppable(); this.views.collections.checkDrop( data ) } ]
            ],
            documentView: [
                [ 'savedClick', function( document ) { this.onDocumentSave( document ) } ],
                [ 'resetClicked', function( model ) { this.views.documentView.update( this.DocumentModel.toList() ) } ],
                [ 'goBackClicked', function( model ) { this.views.documentView.update( this.DocumentModel.toList() ) } ],
                this.views.discTypeJson.on( 'goBackClicked', () => this.emit( 'navigate', '/admin/manage-disc-types' ) )
this.views.discTypeJson.on( 'resetClicked', model => this.views.discTypeJson.update( this.discType.toList() ) )

            ]
        } )
        
        this.views.discTypeJson.on( 'resetClicked', model => this.views.discTypeJson.update( this.discType.toList() ) )
        
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
        this.views.discTypesList.hide()
        .then( () => Promise.resolve( this.createView( 'form', 'createCollection' ) ) )
        .catch( this.Error )
    },

    onGoBackBtnClick() {
        this.emit( 'navigate', '/admin' )
    },

    onItemSelected( item ) {
        this.discType.constructor( item )

        this.emit( 'navigate', item.name, { append: true, silent: true } )
        this.path = [ `manage-disc-types`, item.name ]

        this.views.discTypesList.hide()
        .then( () => {
            this.views.discTypeJson.update( this.discType.toList( item ) )
            return this.views.discTypeJson.show()
        } )
        .catch( this.Error )
    },

    onNavigation( path ) {

        if( path ) this.path = path;

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => {
            const nextView = this.path.length === 2 ? 'discTypeJson' : 'discTypesList';
            if( this.currentView === nextView ) return Promise.resolve()
            return ( this.currentView.length ? this.views[ this.currentView ].hide() : Promise.resolve() )
            .then( () => {
                this.currentView = nextView;
                return this.views[ nextView ].show()
            } )
        } )
        .catch( this.Error ) 


        if( this.isHidden() ) this.showSync()

        if( this.path.length === 2 ) { 
            this.discType.get( { query: { name: this.path[1] } } )
            .then( () => {
                if( Object.keys( this.discType.data ).length === 0 ) return Promise.resolve( this.emit( 'navigate', '/admin/manage-disc-types' ) )
                this.views.discTypeJson.update( this.discType.toList() )
                return this.views.discTypeJson.show()
            } )
            .catch( this.Error )
        } else {
            this.views.discTypesList.show().catch( this.Error )
        } 
    },

    postRender() {
        this.currentView = ''

        this.documentList = Object.create( this.DocumentModel ).constructor( [ ], { resource: this.model.git('currentCollection') } )

        //this.discType = Object.create( this.DiscType )

        this.documentList.getCount()   
        .then( () => Promise.resolve( this.updateCount() ) )
        .catch( this.Error )

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
         
        this.views.discTypeJson.on( 'saveClicked', model => {
            const obj = model.toObj()
            this.discType.put( obj._id, this.omit( obj, [ '_id' ] ) )
            .then( () => this.Toast.showMessage( 'success', 'Disc Type updated.' ) )
            .catch( e => this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) )
        } )
        
        this.views.discTypeJson.on( 'resetClicked', model => this.views.discTypeJson.update( this.discType.toList() ) )
        
        this.views.discTypeJson.on( 'goBackClicked', () => this.emit( 'navigate', '/admin/manage-disc-types' ) )

        this.views.collections.on( 'posted', name => this.views.collections.add( posted ) )

        this.views.collections.on( 'deleteClicked', model => {
            this.views[ this.currentView ].hide()
            .then( () => Promise.resolve( this.createView( 'deleter', 'deleteCollection', model ) ) )
            .catch( this.Error )
        } )

        this.views.discTypesList.on( 'deleteClicked', model =>
            this.views.discTypesList.hide()
            .then( () => Promise.resolve( this.createView( 'deleter', 'deleteDiscType', model ) ) )
            .catch( this.Error )
        )

        this.onNavigation()

        return this
    },

    updateCount() {
        this.els.resource.textContent = `${this.model.git('currentCollection') (${this.documentList.meta.count})`
    },

} )
