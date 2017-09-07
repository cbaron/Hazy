const Super = require('./__proto__')

module.exports = Object.assign( { }, Super, {

    add( datum, sort=false ) {
        if( !this.collection ) this.collection = Object.create( this.Model )

        const keyValue = datum[ this.key ]
        let insertion = { el: this.els.list }

        this.collection.add( datum )
        this.collection.store[ this.key ][ keyValue ] = datum

        if( sort ) {
            this.collection.sort( this.model.git('sort') )
            let index = this.collection.data.findIndex( datum => datum[this.key] == keyValue )
            if( index !== -1 ) insertion = { method: 'insertBefore', el: this.els.list.children.item(index) }
        }

        if( this.itemTemplate ) {

            return this.slurpTemplate( {
                insertion,
                renderSubviews: true,
                template: this.getItemTemplateResult( keyValue, datum )
             } )
            
            this.els.list.querySelector(`*[data-key="${keyValue}"]`).scrollIntoView( { behavior: 'smooth' } )
        }

        this.itemViews[ keyValue ] =
            this.factory.create( this.model.git('view'), { insertion, model: Object.create( this.collection.model ).constructor( datum ) } )
            .on( 'deleted', () => this.onDeleted( datum ) )
       
        this.itemViews[ keyValue ].els.container.scrollIntoView( { behavior: 'smooth' } )
    },

    checkDrag( e ) {
        if( !this.dragging ) return
    
		this.Dragger.els.container.classList.remove('hidden')
		this.Dragger.els.container.style.top = `${e.clientY+5}px`
    	this.Dragger.els.container.style.left = `${e.clientX+5}px`
    },

    checkDragEnd( e ) {
        if( !this.dragging ) return

        this.emit( 'dropped', { e, type: this.draggable, model: this.dragging.model } )
        this.dragging.el.classList.remove('is-dragging')
        this.els.list.classList.remove('is-dragging')
		this.Dragger.els.container.classList.add('hidden')
        this.dragging = false
    },

    checkDragStart( e ) {
        const closestList = e.target.closest('.List')
        if( closestList === null || ( !closestList.isSameNode( this.els.container ) ) ) return
             
        const el = e.target.closest('.item')

        if( !el ) return null

        const model = this.collection.store[ this.key ][ el.parentNode.getAttribute('data-key') ]
        this.dragging = { el: el.parentNode, model }
        this.dragging.el.classList.add('is-dragging')
        this.els.list.classList.add('is-dragging')
        if( model.label ) this.Dragger.els.container.textContent = `Move ${model.label}.`
        this.emit( 'dragStart', this.model.git('draggable') )
    
    },

    checkDrop( { e, type, model } ) {

    },

    fetch() {
        return this.collection.get( { query: { skip: this.model.git('skip'), limit: this.model.git('pageSize'), sort: this.model.git('sort') } } )
        .then( () => this.populateList() )
        .then( () => {
            this.fetched = true
            this.emit('fetched')
            return Promise.resolve()
        } )
    },

    getCount() {
        return this.collection.getCount()
        .then( () => Promise.resolve( this.collection.meta.count ) )
        .catch( this.Error )
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

    hideItems( keys ) {
        return Promise.all(
            keys.map( key => {
                const el = this.els.list.querySelector(`li[data-key="${key}"]`)
                return el ? this.hideEl( el ) : Promise.resolve() 
            } )
        )
        .catch( this.Error )
    },

    hideList() {
        return this.hideEl( this.els.list )
        .then( () => Promise.resolve( this.els.toggle.classList.add('is-hidden') ) )
        .catch( this.Error )
    },

    initializeDragDrop() {
        this.Dragger.on( 'mousedown', e => this.checkDragStart(e) )
        this.Dragger.on( 'mouseup', e => this.checkDragEnd(e) )
        this.Dragger.on( 'mousemove', e => this.checkDrag(e) )
        this.Dragger.listen()
    },

    onDeleted( datum ) { return this.remove( datum ) },


    empty() {
        this.els.list.innerHTML = ''
    },

    events: {
        addBtn: 'click',
        checkbox: 'change',
        goBackBtn: 'click',
        resetBtn: 'click',
        saveBtn: 'click',
        toggle: 'click'
    },

    getListItemKey( e ) {
        const el = e.target.closest('.item')

        if( !el ) return null

        return this.collection.store[ this.key ][ el.parentNode.getAttribute('data-key') ]
    },

    hideDroppable() {
        this.els.list.classList.remove('is-droppable')
        Array.from( this.els.list.children ).forEach( child => child.removeChild( child.lastChild ) )
    },

    onAddBtnClick( e ) {
        this.collection.model
            ? this.add( this.collection.model.CreateDefault() )
            : this.emit('addClicked')
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

    onItemMouseenter( e ) { e.target.classList.add('mouseover') },
    onItemMouseleave( e ) { e.target.classList.remove('mouseover') },

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
        this.emit('resetClicked')
    },

    onSaveBtnClick() {
        if( this.model.git('view') ) {
            this.emit( 'saveClicked', Object.keys( this.itemViews ).map( key => this.itemViews[key].getProposedModel() ) )
        }
    },

    onToggleClick() { this.els.list.classList.contains('hidden') ? this.showList() : this.hideList() },

    populateList() {
        this.els.list.classList.toggle( 'no-items', this.collection.data.length === 0 )

        if( this.collection.data.length === 0 ) return

        if( this.model.git('view') ) {
            let viewName = this.model.git('view')
            const fragment =
                this.collection.data.reduce(
                    ( fragment, datum ) => {
                        const keyValue = datum[ this.key ]
                            
                        this.collection.store[ this.key ][ keyValue ] = datum

                        this.itemViews[ keyValue ] =
                            this.factory.create( viewName, { model: Object.create( this.collection.model ).constructor( datum ), storeFragment: true } )
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
        this.collection = this.model.git('collection') || Object.create( this.Model )
        this.key = this.collection.meta.key

        if( this.collection ) this.collection.store = { [ this.key ]: { } }

        if( this.model.git('delete') ) this.deleteIcon = this.Format.GetIcon('garbage')

        if( this.model.git('fetch') ) this.fetch().catch( this.Error )

        if( this.model.git('draggable') ) this.initializeDragDrop()

        return this
    },

    remove( datum ) {
        this.collection.remove( datum )

        if( this.model.git('view') ) {
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

    showDroppable( type ) {
        this.els.list.classList.add('is-droppable')
        Array.from( this.els.list.children ).forEach( child => {
            this.bindEvent( 'item', 'mouseenter', child )           
            this.bindEvent( 'item', 'mouseleave', child )           
            child.appendChild( this.htmlToFragment(`<div class="drag">Drag here to move ${type}</div>`) )
        } )
    },

    unhideItems() {
        Promise.all( Array.from( this.els.list.querySelectorAll(`li.hidden`) ).map( el => this.showEl(el) ) )
        .catch( this.Error )

        return this
    },

    update( items ) {
        this.collection.constructor( items, { storeBy: [ this.key ] } )

        if( this.itemTemplate ) return this.removeChildren( this.els.list ).populateList()

        this.empty()
        
        Object.assign( this, { itemViews: { } } ).populateList()
        
        //window.scroll( { behavior: 'smooth', top: this.els.container.getBoundingClientRect().top + window.pageYOffset - 50 } )
        this.els.container.scrollIntoView( { behavior: 'smooth' } )

        return this
    },

    updateItem( model ) {
        const keyValue = model.git(this.key)

        this.collection._put( keyValue, model.data )
        
        if( !this.model.git('view') ) {
            let oldItem = this.els.list.querySelector(`*[data-key="${keyValue}"]`)
            this.slurpTemplate( {
                insertion: { method: 'insertBefore', el: oldItem },
                renderSubviews: true,
                template: this.getItemTemplateResult( keyValue, model.data )
            } )
            this.els.list.removeChild( oldItem )
        }
    }
} )
