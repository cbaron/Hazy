module.exports = {

    events: {
        'cancelBtn': 'click',
        'submitBtn': 'click'
    },

    handleSubmissionError( e ) {
        this.Toast.showMessage( 'error', this.toastError || 'Error' )
        this.Error( e )
        this.onSubmitEnd()
    },

    onCancelBtnClick() {
        this.delete().catch( this.Error )
    },

    onSubmitBtnClick() {
        if( this.submitting ) return
        this.onSubmitStart()
        this.submit()
        .then( () => Promise.resolve( this.onSubmitEnd() ) )
        .catch( e => this.handleSubmissionError(e) )
    },

    onSubmitEnd() {
        this.submitting = false
        this.els.submitBtn.classList.remove('submitting')
    },
    
    onSubmitStart() {
        this.submitting = true
        this.els.submitBtn.classList.add('submitting')
    }

}
