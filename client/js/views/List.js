const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    add( datum ) {
        if( !this.collection ) this.collection = Object.create( this.Model )

        const insertion = { el: this.els.list },
            keyValue = datum[ this.key ]

        this.collection.add( datum )

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

    checkDrag( e ) {
        if( !this.dragging ) return
    
		this.Dragger.els.container.classList.remove('hidden')
		this.Dragger.els.container.style.top = `${e.clientY}px`
    	this.Dragger.els.container.style.left = `${e.clientX}px`
    },

    checkDragEnd( e ) {
        if( !this.dragging ) return

        this.emit( 'dropped', this.dragging.model )
        this.dragging.el.classList.remove('is-dragging')
        this.els.container.el.classList.remove('is-dragging')
		this.Dragger.els.container.classList.add('hidden')
        this.dragging = false
    },

    checkDragStart( e ) {
        const el = e.target.closest('.item')

        if( !el ) return null

        this.dragging = { el: el.parentNode, model: this.collection.store[ this.key ][ el.parentNode.getAttribute('data-key') ] }
        this.dragging.el.classList.add('is-dragging')
        this.els.container.classList.add('is-dragging')
    
    },

    getItemTemplateResult( keyValue, datum ) {
        const buttonsOnRight = this.model.git('delete') ? `<div class="buttons">${this.deleteIcon}</div>` : ``,
            selection = this.toggleSelection ? `<div class="selection"><input data-js="checkbox" type="checkbox" /></div>` : ``

        return `<li data-key="${keyValue}">${selection}<div class="item">${this.itemTemplate( datum )}</div>${buttonsOnRight}</li>`
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

    initializeDragDrop() {
        this.els.list.addEventListener( 'mousedown', e => this.checkDragStart(e) )
        this.els.list.addEventListener( 'mouseup', e => this.checkDragEnd(e) )
        this.els.list.addEventListener( 'mousemove', e => this.checkDrag(e) )
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
        const el = e.target.closest('.item')

        if( !el ) return null

        return this.collection.store[ this.key ][ el.parentNode.getAttribute('data-key') ]
    },

    hideDroppable() {
    },

    onCheckboxChange( e ) {
        const el = e.target.closest('LI')

        if( !el ) return false

        const model = this.collection.store[ this.key ][ el.getAttribute('data-key') ]
            event = `toggled${ e.target.checked ? 'On' : 'Off'}`

        if( !model ) return

        el.classList.toggle( 'checked', e.target.checked )

        this.emit( event, model )
    },

    onGoBackBtnClick( e ) {
        this.emit( 'goBackClicked' )
    },

    onListClick( e ) {
        const model = this.getListItemKey( e )

        if( !model ) return

        this.emit( 'itemClicked', model )
    },

    onListDblclick( e ) {
        const model = this.getListItemKey( e )

        if( !model ) return

        this.emit( 'itemDblClicked', model )
    },
    
    onResetBtnClick() {
        this.emit( 'resetClicked' )
    },

    onSaveBtnClick() {
        this.emit( 'saveClicked', this.collection )
    },

    onToggleClick() { this.els.list.classList.contains('hidden') ? this.showList() : this.hideList() },

    populateList() {
        if( this.item ) {
            const fragment =
                this.collection.data.reduce(
                    ( fragment, datum ) => {
                        const keyValue = datum[ this.key ]
                        this.collection.store[ this.key ][ keyValue ] = datum

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
                template: this.collection.data.reduce(
                    ( memo, datum ) => {
                        const keyValue = datum[ this.key ]
                        this.collection.store[ this.key ][ keyValue ] = datum
                        return memo + this.getItemTemplateResult( keyValue, datum )
                    },
                    ''
                )
            } )

            if( this.model.git('delete') ) {
                this.els.list.addEventListener( 'click', e => {
                    const target = e.target
                    if( target.tagName === 'svg' && target.classList.contains('garbage') ) {
                        this.emit( 'deleteClicked', this.collection.store[ this.key ][ target.closest('LI').getAttribute('data-key') ] )
                    }
                } )
            }
        }
    },

    postRender() {
        this.skip = this.skip || 0
        this.pageSize = this.pageSize || 100
        this.key = this.collection.meta.key

        if( this.collection ) this.collection.store = { [ this.key ]: { } }

        if( this.model.git('delete') ) this.deleteIcon = this.Format.GetIcon('garbage')

        if( this.model.git('fetch') ) {
            this.collection.get( { query: { skip: this.skip, limit: this.pageSize, sort: this.collection.meta.sort || { } } } )
            .then( () => this.populateList() )
            .catch( this.Error )
        }

        if( this.model.git('draggable') ) this.initializeDragDrop()

        return this
    },

    remove( datum ) {
        this.collection.remove( datum )

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

    showDroppable() {
    },

    update( items ) {
        if( !this.collection ) this.collection = Object.create( this.Model )

        this.collection.constructor( items, { storeBy: [ this.key ] } )

        if( this.itemTemplate ) return this.removeChildren( this.els.list ).populateList()

        this.empty()
        
        Object.assign( this, { itemViews: { } } ).populateList()
        
        window.scroll( { behavior: 'smooth', top: this.els.container.getBoundingClientRect().top + window.pageYOffset - 50 } )
    }
} )
