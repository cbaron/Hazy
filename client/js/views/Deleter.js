module.exports = Object.assign( { }, require('./__proto__'), require('./Submitter'), {

    events: {
        cancelBtn: 'click',
        submitBtn: 'click',
    },

    onCancelBtnClick() {
        this.delete()
    },

    onSubmitBtnClick() {
        if( this.submitting ) return
        this.onSubmitStart()
        this.submit()
        .then( () => Promise.resolve( this.onSubmitEnd() ) )
        .then( () => this.delete() )
        .catch( e => this.handleSubmissionError(e) )
    },

    submit() {
        return this.model.delete()
        .then( keyValue => {
            this.emit( 'modelDeleted', this.model.data )
            this.Toast.showMessage( 'success', this.toastSuccess || `Success` )
            return Promise.resolve()
        } )
    }

} )
