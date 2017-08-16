const DiscType = require('../models/DiscType')

module.exports = Object.assign( { }, require('./__proto__'), {

    Views: {

        collections: {
            events: { list: 'click' },
            model: Object.create( this.Model ).constructor( { resource: 'Collections' } ),
            itemTemplate: collection => collection.name,
            templateOptions: { heading: 'Collections', toggle: true }
        },

        discTypesList: {

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
            itemTemplate: require('./templates/DiscType'),
            model: Object.create( DiscType ),
            templateOptions: { heading: 'Disc Types', name: 'DiscTypes' }
        },

        discTypeJson: {
            item: 'jsonProperty',
            templateOptions: { goBack: 'Back to Disc Types', heading: 'Disc Type', reset: true, save: true },
            Model: require('../models/JsonProperty')
        }
    },

    discType: Object.create( DiscType ),
    
    events: {
        addButton: 'click',
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

        this.path = path
        
        this.views.discTypeJson.hideSync()
        this.views.discTypesList.hideSync()

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

        if( this.path.length === 2 ) this.onNavigation( this.path )

        return this
    },

    updateCount() {
        this.els.resource.textContent = `DiscType ( ${this.discType.metadata.count} )`
    },

} )
