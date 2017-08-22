const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    Views: { 
        buttonFlow() {
            const start = [ ]
            if( this.canDelete ) start.push( { name: 'delete', svg: this.Format.Icons.garbage( { name: 'delete' } ), emit: true } )
            return {
                model: {
                    data: {
                        states: { start }
                    }
                }
            }
        },
    },

    add( datum ) {
        if( !this.model ) this.model = Object.create( this.Model )

        const insertion = { el: this.els.list },
            keyValue = datum[ this.key ]

        this.model.add( datum )

        if( this.itemTemplate ) {
            return this.slurpTemplate( {
                insertion,
                renderSubviews: true,
                template: this.getItemTemplateResult( keyValue, datum )
             } )
        }

        this.itemViews[ keyValue ] =
            this.factory.create( this.item, { insertion, model: Object.create( this.Model ).constructor( datum ) } )
            .on( 'deleted', () => this.onDeleted( datum ) )
       
        window.scroll( { behavior: 'smooth', top: this.itemViews[ keyValue ].els.container.getBoundingClientRect().bottom - document.documentElement.clientHeight + window.pageYOffset + 50 } )
    },

    getItemTemplateResult( keyValue, datum ) {
        const buttonFlow = this.canDelete ? `<div data-view="buttonFlow"></div>` : ``,
            selection = this.toggleSelection ? `<div class="selection"><input data-js="checkbox" type="checkbox" /></div>` : ``

        return `<li data-key="${keyValue}">${selection}<div class="item">${this.itemTemplate( datum )}</div>${buttonFlow}</li>`
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

    onDeleted( datum ) { return this.remove( datum ) },


    empty() {
        this.els.list.innerHTML = ''
    },

    events: {
        checkbox: 'change',
        goBackBtn: 'click',
        resetBtn: 'click',
        saveBtn: 'click',
        toggle: 'click',
    },

    getListItemKey( e ) {
        const el = e.target.closest('LI')

        if( !el ) return false

        return this.model.store[ this.key ][ el.getAttribute('data-key') ]
    },

    onCheckboxChange( e ) {
        const el = e.target.closest('LI')

        if( !el ) return false

        const model = this.model.store[ this.key ][ el.getAttribute('data-key') ]
            event = `toggled${ e.target.checked ? 'On' : 'Off'}`

        if( !model ) return

        el.classList.toggle( 'checked', e.target.checked )

        this.emit( event, model )
    },

    onGoBackBtnClick( e ) {
        this.emit( 'goBackClicked' )
    },

    onListClick( e ) {
        if( e.target.tagName === 'INPUT' ) return

        const model = this.getListItemKey( e )

        if( !model ) return

        this.emit( 'itemSelected', model )
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
            console.log(this.key)
            this.slurpTemplate( {
                insertion: { el: this.els.list },
                renderSubviews: true,
                template: this.model.data.reduce(
                    ( memo, datum ) => {
                        const keyValue = datum[ this.key ],
                            buttonFlow = this.canDelete ? `<div data-view="buttonFlow"></div>` : ``
                        this.model.store[ this.key ][ keyValue ] = datum
                        return memo + this.getItemTemplateResult( keyValue, datum )
                    },
                    ''
                )
            } )

            if( this.views.buttonFlow ) {
                this.views.buttonFlow.on( 'deleteClicked', e => {
                    const model = this.getListItemKey(e)
                    if( !model ) return

                    this.emit( 'deleteClicked', model )
                } )
            }

        }
    },

    postRender() {
        this.skip = this.skip || 0
        this.pageSize = this.pageSize || 100
        this.key = this.model
            ? this.model.meta.key || '_id'
            : this.Model
                ? this.Model.meta
                    ? this.Model.meta.key
                    : '_id'
                : '_id'

        if( this.model ) this.model.store = { [ this.key ]: { } }

        if( this.model ) {
            this.model.get( { query: { skip: this.skip, limit: this.pageSize, sort: this.model.meta.sort || { } } } )
            .then( () => this.populateList() )
            .catch( this.Error )
        }

        return this
    },

    remove( datum ) {
        this.model.remove( datum )

        if( this.item ) {
            delete this.itemViews[ datum[ this.key ] ]
        } else {
            const child = this.els.list.querySelector( `[data-key="${datum[ this.key ]}"]` )

            if( child ) this.els.list.removeChild( child )
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
