module.exports = Object.assign( { }, require('./__proto__'), require('./Submitter'), {

    clear() { this.inputEls.forEach( el => el.value = '' ) },

    getElementValue( attributes=[], key ) {
        const attribute = attributes.find( attribute => attribute.name === key )

        if( attribute === undefined || ( !attribute.fk && typeof attribute.range === 'string' ) ) return this.els[ key ].value

        if( attribute.fk ) {
            let selectedItem = this.views[ key ].selectedItem
            return selectedItem
                ? selectedItem._id || selectedItem.id
                : undefined
        } else if( typeof attribute.range === 'object' ) {
            return this.views[key].getFormValues()
        }
    },

    getFormValues() {
        const attributes = this.model.attributes

        let data = this.reducer( Object.keys( this.els ), key =>
            /(INPUT|SELECT|TEXTAREA)/.test( this.els[ key ].tagName )
                ? { [key]: this.getElementValue( attributes, key ) }
                : { }
        )

        attributes.forEach( attribute => {
            if( attribute.fk ) { data[ attribute.fk ] = this.views[ attribute.fk ].getSelectedId() }
            else if( typeof attribute.range === "object" ) { data[ attribute.name ] = this.views[ attribute.name ].getFormValues() }
        } )

        return data
    },

    handleValidationError( attr ) {
        this.Toast.showMessage( 'error', attr.error )
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
            this.Toast.showMessage( 'success', this.toastSuccess || `Success` )
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
