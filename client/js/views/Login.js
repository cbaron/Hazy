module.exports = Object.assign( { }, require('./__proto__'), {
    
    events: {
        submit: 'click'
    },

    onSubmitClick() {
        if( this.isSubmitting ) return

        this.isSubmitting = true

        this.validate()
        .then( () => {
            this.els.submit.classList.add('submitting')
            return this.Xhr( {
                data: JSON.stringify( { email: this.els.email.value, password: this.els.password.value } ),
                method: 'post',
                resource: 'auth'
            } )
        } )
        .then( () => this.user.get() )
        .then( () => {
            if( !this.user.isLoggedIn() ) return Promise.reject('Unable to retrieve user')
            this.els.submit.classList.remove('submitting')
            this.hide().then( () => this.emit('loggedIn') ).catch( this.Error )
        } )
        .catch( e => {
            this.isSubmitting = false
            this.els.submit.classList.remove('submitting')
            this.Error(e);
            this.Toast.showError( e || 'Unknown server error')
        } )
    },

    postRender() {
        this.els.email.focus()
        this.els.container.addEventListener( 'keypress', e => { if( e.keyCode === 13 ) this.onSubmitClick() } )

        return this
    },

    requiresLogin: false,

    validate() {
        if( this.els.email.value.trim() === '' ) return Promise.reject( 'Email is required' )
        if( this.els.password.value.trim() === '' ) return Promise.reject( 'Password is required' )
        return Promise.resolve()
    }
} )
