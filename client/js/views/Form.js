module.exports = Object.assign( { }, require('./__proto__'), require('./Submitter'), {

    clear() { this.inputEls.forEach( el => el.value = '' ) },

    getFormValues() {
        return this.reducer( Object.keys( this.els ), key =>
            /(INPUT|SELECT)/.test( this.els[ key ].tagName )
                ? { [key]: this.els[ key ].value }
                : { }
        )
    },

    handleValidationError( attr ) {
        this.Toast.showMessage( 'error', attr.error )
        this.els[ attr.name ].classList.add( 'error' )
        this.onSubmitEnd()
    },

    initTypeAheads() {
        this.model.attributes.forEach( attribute => {
            if( attribute.fk ) this.views[ attribute.fk ].setResource( attribute.fk ).initAutoComplete()
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

        return this.model.post()
        .then( () => {
            this.emit( 'posted', Object.assign( {}, this.model.data ) )
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
        }

        return this 
    }
} )
