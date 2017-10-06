module.exports = Object.assign( {}, require('./__proto__'), {

    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),

    Templates: {
        PaidCash: require('./templates/PaidCash')
    },

    addDivisions() {
        this.Divisions.data.forEach( division => this.slurpTemplate( { template: `<option value="${division.id}">${division.label}</option>`, insertion: { el: this.els.divisionId } } ) )

        return Promise.resolve()
    },

    clear() {
        this.els.name1.value = ''
        this.els.ace1.value = 'null'
        this.els.shirtSize1.value = 'null'
        this.els.disc1.value = 'null'
        this.els.weight1.value = ''
        this.els.name2.value = ''
        this.els.ace2.value = 'null'
        this.els.shirtSize2.value = 'null'
        this.els.disc2.value = 'null'
        this.els.weight2.value = ''
        this.els.email.value = ''
        this.els.phone.value = ''
        this.els.belmontDonation.value = ''
        this.els.ccName.value = ''
        this.els.ccNo.value = ''
        this.els.ccMonth.value = 'null'
        this.els.ccYear.value = 'null'
        this.els.cvc.value = ''
        this.updateTotal()
    },

    disablePayment() {
        this.els.payment.classList.add('disabled')
        this.els.payment.querySelectorAll('input, select').forEach( el => {
            if( !el.isEqualNode( this.els.paidCash ) ) el.setAttribute( 'disabled', 'true' )
        } )

        if( this.waitList === true && this.user.data.roles.includes('admin') ) this.els.paidCash.setAttribute( 'disabled', 'true' )
    },

    enablePayment() {
        this.els.payment.classList.remove('disabled')
        this.els.payment.querySelectorAll('input, select').forEach( el => el.removeAttribute( 'disabled' ) )
        if( this.els.paidCash ) this.els.paidCash.removeAttribute('disabled')
    },

    model: Object.create( require('../models/Byop') ),

    events: {
        ace1: 'change',
        ace2: 'change',
        belmontDonation: 'input',
        divisionId: 'change',
        lastYearResults: 'click',
        paidCash: 'change',
        playersPageLink: 'click',
        submitBtn: 'click'
    },

    onAce1Change() { this.updateTotal() },
    onAce2Change() { this.updateTotal() },

    onBelmontDonationInput() { this.updateTotal() },

    onDivisionIdChange() {
        if( this.els.divisionId.value === "null" ) {
            this.els.spotsLeft.textContent = ``
            this.enablePayment()
            return
        }

        this.Xhr( { resource: 'spotsLeft', qs: JSON.stringify( { divisionId: this.els.divisionId.value } ) } )
        .then( ( { spotsLeft } ) => {
            if( spotsLeft <= 0 ) {
                this.waitList = true
                this.els.spotsLeft.textContent = 'No spots left.  Please register to be placed on the waiting list.'
                this.disablePayment()
                this.model.set( 'total', 0 )
            } else {
                this.els.spotsLeft.textContent = `${spotsLeft} spots left!`
                this.enablePayment()
            }
            return Promise.resolve()
        } )
        .catch( this.Error )
    },

    onPaidCashChange() {
        this.els.paidCash.checked
            ? this.disablePayment()
            : this.enablePayment()

        this.updateTotal()
    },

    onLastYearResultsClick() {
        this.emit( 'navigate', '/byop-2016' )
    },

    onPlayersPageLinkClick() {
        this.emit( 'navigate', '/byop-players' )
    },

    onSubmitBtnClick() {
        if( this.submitting ) return

        this.onSubmitStart()

        this.validate()
        .then( result => {
            if( !result ) return Promise.resolve( this.onSubmitEnd() )

            return this.model.post()
            .then( response => {
                return this.Toast.createMessage( 'success', response.message )
                .then( () => {
                    this.emit( 'navigate', '/byop-players' )
                    this.onSubmitEnd()
                    this.clear()
                } )
            } )
            .catch( e => {
                this.Toast.createMessage( 'error', e && e.message ? e.message : `There was a problem.  Please try again or contact us.` );
                this.onSubmitEnd()
            } )
        } )
        .catch( e => { this.Error(e); this.submitting = false } )
    },

    onSubmitEnd() {
        this.submitting = false
        this.els.submitBtn.classList.remove('submitting')
    },
    
    onSubmitStart() {
        this.submitting = true
        this.els.submitBtn.classList.add('submitting')
    },

    postRender() {
        
        this.model.on( 'totalChanged', () => this.els.total.textContent = this.Format.Currency.format( this.model.git('total') ) )
        this.els.container.querySelectorAll('input, select').forEach( el => el.addEventListener( 'focus', e => e.target.classList.remove('error') ) )

        this.Divisions.get()
        .then( () => this.addDivisions() )
        .catch( e => this.Error(e) )

        if( this.user.data.roles.includes('admin') ) {
            this.slurpTemplate( { template: this.Templates.PaidCash(), insertion: { method: 'insertBefore', el: this.els.totalWrap } } )
        }

        return this
    },

    updateTotal() {
        if( this.waitList ) return this.model.set( 'total', 0 )

        let total = this.model.meta.basePrice

        if( this.els.paidCash && this.els.paidCash.checked ) total -= 3.5

        if( this.els.ace1.value === "true" ) total += 5
        if( this.els.ace2.value === "true" ) total += 5
       
        const belmontDonation = window.parseFloat( this.els.belmontDonation.value ) 
        if( !window.isNaN( belmontDonation ) && belmontDonation > 0 ) total += belmontDonation

        this.model.set( 'total', total )
    },

    validate() {
        let rv = true;

        Object.keys( this.els ).forEach( attr => {        
            const el = this.els[ attr ]
            
            if( el.tagName !== "INPUT" && el.tagName !== "SELECT" ) return

            if( ( this.waitList === true || ( this.els.paidCash && this.els.paidCash.checked ) ) && [ 'ccName', 'ccNo', 'ccMonth', 'ccYear', 'cvc'  ].includes( attr ) ) return

            if( rv === true && !this.model.validate( attr, el.value ) ) {
                this.Toast.createMessage( 'error', this.model.meta[ attr ].error || `${attr} required` )
                el.scrollIntoView( { behavior: 'smooth' } )
                el.classList.add( 'error' )
                rv = false
            } else if( this.model.validate( attr, el.value ) ) {
                this.model.data[ attr ] = attr === "paidCash"
                    ? Boolean( el.checked )
                    : attr === "ace1" || attr === "ace2"
                        ? Boolean( el.value === "true" )
                        : el.value
            }
        } )

        return Promise.resolve( rv )
    }

} )
