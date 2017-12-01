const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    add( datum={} ) {
        this.createItemViews( [ datum ] )
        this.itemViews[ this.itemViews.length - 1 ].els.container.scrollIntoView( { behavior: 'smooth' } )
        this.updateStyle()
    },

    createItemViews( data ) {
        const fragment =
            data.reduce(
                ( fragment, datum ) => {
                    const opts = {
                        model: Object.create( this.Model ).constructor( datum, {
                            attributes: this.model.git('range'),
                            meta: this.collection.meta
                        } ),
                        templateOptions: { delete: true, hideButtonRow: true }
                    }

                    const view = this.factory.create( this.viewName, Object.assign( opts, { storeFragment: true } ) )
                        .on( 'deleted', () => this.onItemViewDeleted( view ) )

                    this.itemViews.push( view )
                    this.emit( 'itemAdded', view )

                    while( view.fragment.firstChild ) fragment.appendChild( view.fragment.firstChild )
                    return fragment
                },
                document.createDocumentFragment()
            )

        this.els.list.appendChild( fragment )
    },

    events: {
        addBtn: 'click'
    },

    onAddBtnClick( e ) { this.add() },

    onItemViewDeleted( view ) {
        const viewIndex = this.itemViews.indexOf( view )

        this.itemViews.splice( viewIndex, 1 )
        this.els.container.scrollIntoView( { behavior: 'smooth' } )
        this.updateStyle()

        this.emit( 'itemDeleted', view )
    },

    populateList() {
        let data = this.collection.data

        if( !Array.isArray( data ) ) data = [ data ]
        if( !data.length ) data = [ { } ]

        this.createItemViews( data )
    },

    postRender() {
        this.viewName = this.model.git('view')
        this.itemViews = [ ]
        this.collection = this.model.git('collection') || Object.create( this.Model )

        this.populateList()
        this.updateStyle()

        return this
    },

    reduceToOne() {
        return this.itemViews.length > 1
            ? Promise.all( this.itemViews.slice(1).map( itemView => itemView.delete() ) ).catch( this.Error )
            : Promise.resolve()
    },

    updateStyle() {
        if( !this.model.git('delete') ) return

        this.itemViews.forEach( view =>
            view.els.deleteBtn.classList.toggle( 'hidden', this.itemViews.length === 1 )
        )
    }

} )