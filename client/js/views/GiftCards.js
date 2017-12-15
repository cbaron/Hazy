module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {

        giftCardTransaction() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/GiftCardTransaction').attributes,
                    data: { total: 0 },
                    meta: {
                        noLabel: true,
                        isProcessed: { hide: true }
                    },
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
                toastSuccess: 'Thank you for your purchase! You will receive an email confirmation shortly.',
                submit() {
                    if( !this.validate( this.getFormValues() ) ) return Promise.resolve( this.onSubmitEnd() )

                    const isPost = !Boolean( this.model.data[ this.key ]  )

                    return ( isPost ? this.model.post() : this.model.put( this.model.data[ this.key ], this.omit( this.model.data, [ this.key ] ) ) )
                    .then( () => this.Toast.createMessage( 'success', this.toastSuccess || `Success` ) )
                    .then( () => {
                        this.emit( isPost ? 'posted' : 'put', Object.assign( {}, this.model.data ) )
                        this.model.data = { }
                        this.clear()
                        this.onSubmitEnd()
                    } )
                }
            }
        }

    },

    events: {
        views: {
            giftCardTransaction: [
                [ 'posted', function() {
                    return this.reset()
                    .then( () => this.emit( 'navigate', '/' ) )
                    .catch( this.Error )
                } ]
            ]
        }
    },

    postRender() {
        this.views.giftCardTransaction.on( 'cancel', () => this.reset() )
        this.views.giftCardTransaction.on( 'error', e => true )

        this.views.giftCardTransaction.model.on( 'totalChanged', () =>
            this.views.giftCardTransaction.els.total.textContent = this.Format.Currency.format( this.views.giftCardTransaction.model.git('total') )
        )

        this.recipients = this.views.giftCardTransaction.views.recipients

        this.recipients.itemViews.forEach( view => view.els.amount.addEventListener( 'input', () => this.updateTotal() ) )

        this.recipients
        .on( 'itemAdded', view => {
            view.els.amount.addEventListener( 'input', () => this.updateTotal() )
        } )
        .on( 'itemDeleted', () => {
            if( this.views.giftCardTransaction.model.git('total') !== 0 ) this.updateTotal()
        } )

        return this
    },

    reset() {
        this.views.giftCardTransaction.clear()
        this.views.giftCardTransaction.model.set( 'total', 0 )

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

        if( Number.isNaN( total ) || total < 0 ) total = 0

        this.views.giftCardTransaction.model.set( 'total', total )
    }

} )