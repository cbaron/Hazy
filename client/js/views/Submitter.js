module.exports = {

    events: {
        'submitBtn': 'click'
    },

    handleSubmissionError( e ) {
        this.Toast.showMessage( 'error', this.toastError || 'Error' )
        this.Error( e )
        this.onSubmitEnd()
    },

    onSubmitBtnClick() {
        if( this.submitting ) return
        this.onSubmitStart()
        this.submit()
        .then( () => this.onSubmitEnd() )
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
