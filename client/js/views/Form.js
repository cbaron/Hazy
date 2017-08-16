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

        this.els.container.addEventListener( 'keyup', e => { if( e.keyCode === 13 ) this.onSubmitBtnClick() } )

        this.inputEls.forEach( el =>
            el.addEventListener( 'focus', () => el.classList.remove('error') )
        )

        this.model.on( 'validationError', attr => this.handleValidationError( attr ) )

        return this 
    }
} )
