module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        purchaseGiftCard() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/GiftCardTransaction').attributes,
                    data: { total: 0 },
                    meta: { noLabel: true },
                    resource: 'GiftCardTransaction'
                } ),
                templateOptions() {
                    return {
                        displayTotal: true,
                        heading: 'Contact',
                        prompt: 'Enter your information below.'
                    }
                },
                onCancelBtnClick() { this.emit('cancel') },
                toastSuccess: 'Thank you for your purchase! You will receive an email confirmation shortly.'
            }
        }

    },

    events: {
        views: {
            purchaseGiftCard: [
                [ 'posted', function() {
                    return this.reset()
                    .then( () => this.emit( 'navigate', '/' ) )
                    .catch( this.Error )
                } ]
            ]
        }
    },

    postRender() {
        this.ccFee = 3.5

        this.views.purchaseGiftCard.on( 'cancel', () => this.reset() )

        this.recipients = this.views.purchaseGiftCard.views.recipients

        this.recipients.itemViews.forEach( view => view.els.amount.addEventListener( 'input', () => this.updateTotal() ) )

        this.recipients
        .on( 'itemAdded', view => {
            view.els.amount.addEventListener( 'input', () => this.updateTotal() )
        } )
        .on( 'itemDeleted', () => {
            if( this.views.purchaseGiftCard.model.git('total') !== 0 ) this.updateTotal()
        } )

        return this
    },

    reset() {
        this.views.purchaseGiftCard.clear()
        this.views.purchaseGiftCard.els.total.textContent = this.Format.Currency.format( 0 )

        return this.recipients.reduceToOne()
        .then( () => this.els.container.scrollIntoView( { behavior: 'smooth' } ) )
        .catch( this.Error )
    },

    updateTotal() {
        let total = this.recipients.itemViews.reduce( ( memo, view ) => {
            let val = view.els.amount.value.trim()
            if( !val ) return memo
            else if( window.parseFloat( val ) > 1000 || window.parseFloat( val ) < 0 ) val = 0
            return memo + window.parseFloat( val )
        }, 0 )

        total = ( !Number.isNaN( total ) && total > 0 ) ? total += this.ccFee : 0

        this.views.purchaseGiftCard.model.set( 'total', total )
        this.views.purchaseGiftCard.els.total.textContent = this.Format.Currency.format( total )

    }

} )