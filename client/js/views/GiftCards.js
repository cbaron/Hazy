module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        purchaseGiftCard() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/GiftCardTransaction').attributes,
                    data: {
                        total: 3.5,
                        delivery: 'inStore',
                        isProcessed: false
                    },
                    meta: { noLabel: true },
                    resource: 'GiftCardTransaction'
                } ),
                templateOptions() {
                    return {
                        disallowEnterKeySubmission: true,
                        displayTotal: true,
                        heading: 'Contact',
                        prompt: 'Enter your information below.'
                    }
                }
            }
        }

    },

    postRender() {
        this.recipients = this.views.purchaseGiftCard.views.recipients

        this.recipients.itemViews.forEach( view => view.els.amount.addEventListener( 'change', () => this.updateTotal() ) )

        this.recipients
        .on( 'itemAdded', view => {
            view.els.amount.addEventListener( 'change', () => this.updateTotal() )
        } )
        .on( 'itemDeleted', () => {
            if( this.views.purchaseGiftCard.model.git('total') !== 0 ) this.updateTotal()
        } )

        return this
    },

    updateTotal() {
        let total = this.recipients.itemViews.reduce( ( memo, view ) => {
            if( !view.els.amount.value ) return memo
            return memo + window.parseFloat( view.els.amount.value )
        }, 3.5 )

        this.views.purchaseGiftCard.model.set( 'total', total )
        this.views.purchaseGiftCard.els.total.textContent = this.Format.Currency.format( total )
    }

} )