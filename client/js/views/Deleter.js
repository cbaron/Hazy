module.exports = Object.assign( { }, require('./__proto__'), require('./Submitter'), {

    events: {
        cancelBtn: 'click',
        okBtn: 'click',
        submitBtn: 'click',
    },

    onCancelBtnClick() { this.delete() },

    onOkBtnClick() { this.delete() },

    onSubmitBtnClick() {
        if( this.submitting ) return
        this.onSubmitStart()
        return this.submit()
        .then( () => Promise.resolve( this.onSubmitEnd() ) )
        .then( () => this.hasReferences ? Promise.resolve() : this.delete() )
        .catch( e => this.handleSubmissionError(e) )
    },

    showConstraintInfo( fkReferences ) {
        fkReferences.forEach( datum =>
            this.slurpTemplate( {
                insertion: { el: this.els.fkReferences },
                template: `<li>${datum.collection}: ${datum.number} documents</li>`
            } )
        )

        return this.hideEl( this.els.deletion )
        .then( () => this.showEl( this.els.constraintInfo ) )
        .catch( this.Error )
    },

    submit() {
        return this.model.delete()
        .then( response => {
            if( response.fkReferences ) {
                this.hasReferences = true
                return this.showConstraintInfo( response.fkReferences )
            }

            this.emit( 'modelDeleted', this.model.data )
            this.Toast.createMessage( 'success', this.toastSuccess || `Success` )
            return Promise.resolve()
        } )
    }

} )
