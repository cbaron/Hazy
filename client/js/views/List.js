const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    add( datum ) {
        if( !this.model ) this.model = Object.create( this.Model )

        const insertion = { el: this.els.list },
            keyValue = datum[ this.key ]

        this.model.add( datum )

        if( this.itemTemplate ) {
            return this.slurpTemplate( {
                insertion,
                renderSubviews: true,
                template: `<li data-key="${keyValue}">${this.itemTemplate( datum )}</li>`
             } )
        }

        this.itemViews[ keyValue ] =
            this.factory.create( this.item, { insertion, model: Object.create( this.Model ).constructor( datum ) } )
            .on( 'deleted', () => this.onDeleted( datum ) )
       
        window.scroll( { behavior: 'smooth', top: this.itemViews[ keyValue ].els.container.getBoundingClientRect().bottom - document.documentElement.clientHeight + window.pageYOffset + 50 } )
    },

    hide() {
        if( this.els.resetBtn ) this.els.resetBtn.classList.add('hidden')
        if( this.els.saveBtn ) this.els.saveBtn.classList.add('hidden')
        return Reflect.apply( Super.hide, this, [ ] )
    },

    hideList() {
        return this.hideEl( this.els.list )
        .then( () => Promise.resolve( this.els.toggle.classList.add('is-hidden') ) )
        .catch( this.Error )
    },

    onDeleted( datum ) {
        this.model.remove( datum )

        if( this.item ) {
            delete this.itemViews[ datum[ this.key ] ]
        } else {
            const child = this.els.list.querySelector( `[data-key="${datum[ this.key ]}"]` )

            if( child ) this.els.list.removeChild( child )
        }
    },

    empty() {
        this.els.list.innerHTML = ''
    },

    events: {
        goBackBtn: 'click',
        resetBtn: 'click',
        saveBtn: 'click',
        toggle: 'click',
    },

    onGoBackBtnClick( e ) {
        this.emit( 'goBackClicked' )
    },

    onListClick( e ) {
        const el = e.target.closest('LI')

        if( !el ) return

        this.emit( 'itemSelected', this.model.store[ this.key ][ el.getAttribute('data-key') ] )
    },
    
    onResetBtnClick() {
        this.emit( 'resetClicked' )
    },

    onSaveBtnClick() {
        this.emit( 'saveClicked', this.model )
    },

    onToggleClick() { this.els.list.classList.contains('hidden') ? this.showList() : this.hideList() },

    populateList() {
        if( this.item ) {
            const fragment =
                this.model.data.reduce(
                    ( fragment, datum ) => {
                        const keyValue = datum[ this.key ]
                        this.model.store[ this.key ][ keyValue ] = datum

                        this.itemViews[ keyValue ] =
                            this.factory.create( this.item, { model: Object.create( this.Model ).constructor( datum ), storeFragment: true } )
                                .on( 'deleted', () => this.onDeleted( datum ) )

                        while( this.itemViews[ keyValue ].fragment.firstChild ) fragment.appendChild( this.itemViews[ keyValue ].fragment.firstChild )
                        return fragment
                    },
                    document.createDocumentFragment()
                )

            this.els.list.appendChild( fragment )
        } else {
            this.slurpTemplate( {
                insertion: { el: this.els.list },
                renderSubviews: true,
                template: this.model.data.reduce(
                    ( memo, datum ) => {
                        const keyValue = datum[ this.key ]
                        this.model.store[ this.key ][ keyValue ] = datum
                        return memo + `<li data-key="${keyValue}">${this.itemTemplate( datum )}</li>`
                    },
                    ''
                )
            } )
        }
    },

    postRender() {
        this.skip = this.skip || 0
        this.pageSize = this.pageSize || 100
        this.key = this.Model.meta ? this.Model.meta.key : '_id'

        if( this.model ) this.model.store = { [ this.key ]: { } }

        if( this.model ) {
            this.model.get( { query: { skip: this.skip, limit: this.pageSize, sort: this.model.meta.sort || { } } } )
            .then( () => this.populateList() )
            .catch( this.Error )
        }

        return this
    },

    show() {
        if( this.els.resetBtn ) this.els.resetBtn.classList.remove('hidden')
        if( this.els.saveBtn ) this.els.saveBtn.classList.remove('hidden')
        return Reflect.apply( Super.show, this, [ ] )
    },

    showList() {
        return this.showEl( this.els.list )
        .then( () => Promise.resolve( this.els.toggle.classList.remove('is-hidden') ) )
        .catch( this.Error )
    },

    update( items ) {
        if( !this.model ) this.model = Object.create( this.Model )

        this.model.constructor( items, { storeBy: [ this.key ] } )

        if( this.itemTemplate ) return this.removeChildren( this.els.list ).populateList()

        this.empty()
        
        Object.assign( this, { itemViews: { } } ).populateList()
        
        window.scroll( { behavior: 'smooth', top: this.els.container.getBoundingClientRect().top + window.pageYOffset - 50 } )
    }
} )
