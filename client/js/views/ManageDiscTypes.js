module.exports = Object.assign( { }, require('./__proto__'), {

    Collection: require('../models/Collection'),
    DiscType: require('../models/DiscType'),

    Views: {

        collections() {
            return {
                Views: {
                },
                events: { list: 'click' },
                model: Object.create( this.Collection ),
                //itemTemplate: collection => <div><span>collection</span><div data-view="buttonFlow"></div></div>,
                itemTemplate: collection => collection,
                templateOptions: { heading: 'Collections', name: 'Collections', toggle: true }
            }
        },

        createCollection() {
            return {
                model: Object.create( this.Collection ).constructor(),
                templateOptions: { heading: 'Create Collection' }
            }
        },

        discTypesList() {
            return {
                Views: { 
                    buttonFlow: { model: { data: {
                        disabled: true,
                        states: { 
                            start: [
                                { name: 'edit', svg: require('./templates/lib/pencil')( { name: 'edit' } ), emit: true },
                                { name: 'delete', svg: require('./templates/lib/garbage')( { name: 'delete' } ), nextState: 'confirmDelete' }
                            ],
                            confirmDelete: [
                                { name: 'confirmDelete', text: 'Delete Disc Type?', emit: true, nextState: 'start' },
                                { name: 'cancel', svg: require('./templates/lib/ex')( { name: 'cancel' } ), nextState: 'start' }
                            ]
                        }
                    } } },
                },

                events: { list: 'click' },
                itemTemplate: this.Templates.DiscType,
                model: Object.create( this.DiscType ),
                templateOptions: { heading: 'Disc Types', name: 'DiscTypes' }
            }
        },

        discTypeJson: {
            item: 'jsonProperty',
            templateOptions: { goBack: 'Back to Disc Types', heading: 'Disc Type', reset: true, save: true },
            Model: require('../models/JsonProperty')
        }
    },
                
    Templates: {
        DiscType: require('./templates/DiscType')
    },

    events: {
        addButton: 'click',
        createCollectionBtn: 'click',
        goBackBtn: 'click'
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
        .then( () => {
            this.currentView = 'createCollection'
            this.views.createCollection.show()
        } )
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

        if( path ) this.path = path

        ( this.isHidden() ? this.show() : Promise.resolve() )
        .then( () => {
            const nextView = this.path.length === 2 ? 'discTypeJson' : 'discTypesList'
            if( this.currentView === nextView ) return Promise.resolve()
            return ( this.currentView.length ? this.views[ this.currentView ].hide() : Promise.resolve() )
            .then( () => {
                this.currentView = nextView
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

        this.discType = Object.create( this.DiscType )
    
        this.discType.getCount()
        .then( () => Promise.resolve( this.updateCount() ) )
        .catch( this.Error )

        this.views.discTypesList.on( 'itemSelected', item => this.onItemSelected( item ) )
      
        this.views.discTypeJson.els.container.classList.add('hidden')
         
        this.views.discTypeJson.on( 'saveClicked', model => {
            const obj = model.toObj()
            this.discType.put( obj._id, this.omit( obj, [ '_id' ] ) )
            .then( () => this.Toast.showMessage( 'success', 'Disc Type updated.' ) )
            .catch( e => this.Toast.showMessage( 'error', `Something went wrong.  Try again, or bother Mike Baron.` ) )
        } )
        
        this.views.discTypeJson.on( 'resetClicked', model => this.views.discTypeJson.update( this.discType.toList() ) )
        
        this.views.discTypeJson.on( 'goBackClicked', () => this.emit( 'navigate', '/admin/manage-disc-types' ) )

        this.views.createCollection.on( 'posted', name => this.views.collections.add( posted ) )

        this.onNavigation()

        return this
    },

    updateCount() {
        this.els.resource.textContent = `DiscType ( ${this.discType.meta.count} )`
    },

} )
