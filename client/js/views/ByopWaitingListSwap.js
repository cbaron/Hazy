module.exports = Object.assign( { }, require('./__proto__'), {
    
    Views: {

        buttonFlow: { model: { value: { data: {
            disabled: true,
            states: { 
                start: [
                    { name: 'doSwap', class: '', text: 'Swap!', nextState: 'confirm' },
                    { name: 'cancelSwap', class: '', text: 'Cancel', nextState: 'start', emit: true }
                ],
                confirm: [
                    { name: 'confirmSwap', class: '', text: 'Are you Sure?', emit: true, nextState: 'start' },
                    { name: 'cancel', class: '', nextState: 'start', text: 'Cancel', emit: true }
                ]
            }
        } } } },

        typeAhead: {
            query: { waitList: false },
            templateOptions: { value: { label: 'Player name' } }
        }
    },
    
    WaitingList: Object.create( require('../models/__proto__'), { resource: { value: 'waiting-list' } } ),

    clear() {
        this.initWaitingList()

        this.removeTeam = undefined
        this.updateExplanation()
        this.views.buttonFlow.disable()
        this.views.typeAhead.clear( true )
    },

     events: {
        heading: 'click',
        waitingList: 'change'
    },

    initWaitingList() {
        if( this.WaitingList.data.length > 0 ) {
            this.views.divisionDropdown.select( this.WaitingList.data[0].divisionId )
            this.waitingDivision = this.views.divisionDropdown.getModel( this.WaitingList.data[0].divisionId )
        }
    },

    onHeadingClick() { this.els.content.classList.contains('hidden') ? this.showEl( this.els.content ) : this.hideEl( this.els.content ) },

    onSubmitting() {
        this.submitting = true
        this.views.buttonFlow.disable()
    },
    
    onDoneSubmitting() {
        this.submitting = false
        this.views.buttonFlow.enable
    },

    onWaitingListChange() {
        this.updateExplanation()
        this.views.divisionDropdown.select( this.WaitingList.store.id[ this.els.waitingList.value ].divisionId )
    },

    postRender() {

        this.views.typeAhead.on( 'teamSelected', team => {
            this.removeTeam = team
            this.updateExplanation()
            this.views.buttonFlow.enable()
        } )
        
        this.views.typeAhead.on( 'cleared', () => this.clear() )

        this.views.divisionDropdown.on( 'changed', division => {
            this.waitingDivision = division
            this.updateExplanation()
        } )

        this.views.divisionDropdown.on( 'added', () =>
            this.WaitingList.get( { storeBy: [ 'id' ] } )
            .then( () => this.renderWaitingList() )
            .then( () => {
                this.initWaitingList()
                return Promise.resolve()
            } )
            .catch( e => this.Error(e) )
        )

        this.views.buttonFlow.on( 'cancelSwapClicked', () => this.clear() )
        this.views.buttonFlow.on( 'cancelClicked', () => this.clear() )
        this.views.buttonFlow.on( 'confirmSwapClicked', () => {
            if( this.submitting ) return

            this.onSubmitting()

            this.Xhr( { method: 'POST', resource: 'byop-swap', data: JSON.stringify( { out: this.removeTeam.id, in: this.els.waitingList.value, divisionId: this.waitingDivision.id } ) } )
            .then( result => {
                return this.Toast.createMessage( 'success', 'Swapped!' )
                .then( () => {
                    this.els.waitingList.removeChild( this.els.waitingList.querySelector( `option[value="${this.els.waitingList.value}"]` ) )
                    this.clear()
                    this.onDoneSubmitting()
                    return Promise.resolve()
                } )
                .catch( this.Error )
            } )
            .catch( e => {
                this.Toast.createMessage( 'error', e.message ).catch( this.Error )
                this.onDoneSubmitting()
            } )
        } )

        return this
    },

    renderWaitingList() {
        this.WaitingList.data.forEach( datum =>
            this.slurpTemplate( { template: `<option value="${datum.id}">${datum.name1}, ${datum.name2}</option>`, insertion: { el: this.els.waitingList } } )
        )

        return Promise.resolve()
    },

    updateExplanation() {
        if( this.removeTeam === undefined ) return this.els.explanation.textContent = ``

        const waitingTeam = this.WaitingList.store.id[ this.els.waitingList.value ],
            waitingTeamLabel = `${waitingTeam.name1}, ${waitingTeam.name2}`,
            removeTeam = `${this.removeTeam.name1}, ${this.removeTeam.name2}`,
            removeDivision = this.views.divisionDropdown.getModel( this.removeTeam.divisionId ).label

        let explanation = `Remove ${removeTeam} ( division: ${removeDivision} ) from event, and put ${waitingTeamLabel} ( division: ${this.waitingDivision.label} ) in their place?  `

        explanation +=
            this.removeTeam.hasPaid
                ? this.removeTeam.paidCash
                    ? `${removeTeam} paid in cash, so you will have to manage the refund in person, then update their 'refund' record attribute.`
                    : this.removeTeam.stripeChargeId
                        ? `${removeTeam} paid via Stripe, so they will be refunded automatically.`
                        : `${removeTeam} has slipped through the system, ask CBaron what's up here.`
                : `${removeTeam} have not paid, so there is no need to refund them.`

        this.els.explanation.textContent = explanation
    }
} )
