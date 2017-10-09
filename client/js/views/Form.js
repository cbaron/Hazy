module.exports = Object.assign( { }, require('./__proto__'), require('./Submitter'), {

    clear() { this.inputEls.forEach( el => el.value = '' ) },

    getElementValue( el, attribute ) {
        if( attribute === undefined || ( !attribute.fk && typeof attribute.range === 'string' && attribute.range ) ) return el.value

        /*
        if( attribute.fk ) {
            let selectedItem = this.views[ attribute.name ].selectedItem
            return selectedItem
                ? selectedItem._id || selectedItem.id
                : undefined
        } else if( typeof attribute.range === 'object' ) {
            return el.getFormValues()
        } else if( attribute.range === "List" ) { return Array.from( this.views[ attribute.name ].els.list.children ).map( item => this.getElementValue( item, { range: attribute.itemRange } ) ) }
        */
    },

    getFormValues() {
        const attributes = this.model.attributes

        let data = this.reducer( Object.keys( this.els ), key =>
            /(INPUT|SELECT|TEXTAREA)/.test( this.els[ key ].tagName )
                ? { [key]: this.getElementValue( this.els[ key ], attributes.find( attribute => attribute.name === key ) ) }
                : { }
        )

        attributes.forEach( attribute => {
            if( attribute.fk ) { data[ attribute.fk ] = this.views[ attribute.fk ].getSelectedId() }
            else if( typeof attribute.range === "object" ) { data[ attribute.name ] = this.views[ attribute.name ].getFormValues() }
            else if( attribute.range === "List" ) {
                data[ attribute.name ] = Array.from( this.views[ attribute.name ].els.list.children ).map( itemEl => this.getElementValue( itemEl.querySelector('.item input'), { range: attribute.itemRange } ) ) }
        } )

        return data
    },

    handleValidationError( attr ) {
        this.Toast.createMessage( 'error', attr.error )
        this.els[ attr.name ].classList.add( 'error' )
        this.onSubmitEnd()
    },

    initTypeAheads() {
        this.model.attributes.forEach( attribute => {
            if( attribute.fk ) this.views[ attribute.fk ].setResource( attribute.fk ).initAutoComplete( this.model.git( attribute.fk ) )
            else if( typeof attribute.range === "object" ) {
                this.Views[ attribute.name ] = {
                    model: Object.create( this.Model ).constructor( this.model.data[ attribute.name ], { attributes: attribute.range } ),
                    templateOptions: { hideButtonRow: true }
                }
                const el = this.els[ attribute.name ]
                delete this.els[ attribute.name ]
                this.subviewElements = [ { el, view: 'form', name: attribute.name } ]
                this.renderSubviews()
            } else if( attribute.range === "List" ) {
                const collectionData = this.model.git( attribute.name ) ? this.model.git( attribute.name ).map( datum => ( { value: datum } ) ) : [ ];
                this.Views[ attribute.name ] = {
                    model: Object.create( this.model ).constructor( {
                        add: true,
                        collection: Object.create( this.Model ).constructor( collectionData, { meta: { key: 'value' } } ),
                        delete: true
                    } ),
                    itemTemplate: datum => Reflect.apply( this.Format.GetFormField, this.Format, [ { range: attribute.itemRange }, datum.value ] )
                }
                const el = this.els[ attribute.name ]
                delete this.els[ attribute.name ]
                this.subviewElements = [ { el, view: 'list', name: attribute.name } ]
                this.renderSubviews()
                this.views[ attribute.name ].on( 'addClicked', () => this.views[ attribute.name ].add( { value: '' } ) )
                this.views[ attribute.name ].on( 'deleteClicked', datum => this.views[ attribute.name ].remove( datum ) )
            }
        } )
    },

    submit() {
        if( ! this.model.validate( this.getFormValues() ) ) return Promise.resolve()

        const isPost = !Boolean( this.model.data[ this.key ]  )

        return ( isPost ? this.model.post() : this.model.put( this.model.data[ this.key ], this.omit( this.model.data, [ this.key ] ) ) )
        .then( () => {
            this.emit( isPost ? 'posted' : 'put', Object.assign( {}, this.model.data ) )
            this.model.data = { }
            this.clear()
            this.Toast.createMessage( 'success', this.toastSuccess || `Success` )
            return Promise.resolve()
        } )
    },

    postRender() {
        this.inputEls = this.els.container.querySelectorAll('input, select')

        if( !this.disallowEnterKeySubmission ) this.els.container.addEventListener( 'keyup', e => { if( e.keyCode === 13 ) this.onSubmitBtnClick() } )

        this.inputEls.forEach( el =>
            el.addEventListener( 'focus', () => el.classList.remove('error') )
        )

        if( this.model ){
             this.model.on( 'validationError', attr => this.handleValidationError( attr ) )
             this.initTypeAheads()
             this.key = this.model.metadata ? this.model.metadata.key : '_id'
        }

        return this 
    }
} )
