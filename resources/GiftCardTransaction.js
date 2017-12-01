module.exports = Object.assign( { }, require('./__proto__'), {

    Stripe: require('./lib/Stripe'),

    email: require('../lib/Email'),

    notifySales() {
        const giftCards = this.body.recipients.map( recipient =>
            `Amount: $${Number.parseFloat( recipient.amount ).toFixed(2)}\n` +
            `Recipient Name: ${recipient.name}`
        ).join('\n\n')

        return this.email.send( {
            to: 'sales@hazyshade.com',
            from: 'no-reply@hazyshade.com',
            subject: `Gift Card(s) Purchased`,
            body:
                `A customer has made a gift card purchase with the following details:\n\n` +
                `Name: ${this.body.name}\n` +
                `Email: ${this.body.email}\n` +
                `Phone: ${this.body.phone}\n\n` +
                `Gift Card(s):\n\n` +
                `${giftCards}`
        } )
        .catch( e => Promise.resolve( console.log( 'Failed to send purchase details to sales.' ) ) )
    },

    POST() {
        return this.getUser()
        .then( () => this.slurpBody() )
        .then( () => this.validate() )
        .then( () => {
            this.payment = this.body.payment
            this.body = this.omit( this.body, [ 'payment' ] )

            return this.Mongo.POST( this )
        } )
        .then( ( [ { _id } ] ) => this.pay( _id ) )
    },

    pay( giftCardTransactionId ) {
        return this.Stripe.charge( {
            amount: Math.floor( this.body.total * 100 ),
            metadata: { giftCardTransactionId: giftCardTransactionId.toString(), name: this.body.name },
            receipt_email: this.body.email,
            source: {
                exp_month: this.payment.ccMonth,
                exp_year: this.payment.ccYear,
                number: this.payment.ccNo,
                object: 'card',
                cvc: this.payment.cvc
            },
            statement_descriptor: 'HazyShade Gift Card'
        } )
        .catch( e => {
            console.log( e.stack || e )

            return this.Mongo.DELETE( this, giftCardTransactionId )
            .then( () => this.respond( { stopChain: true, code: 500, body: { message: 'Error processing payment. Please try again.' } } ) )
        } )
        .then( charge => {
            Object.assign( this.body, { stripeChargeId: charge.id, isProcessed: false } )

            return this.Mongo.PUT( this, giftCardTransactionId )
        } )
        .then( () => this.notifySales() )
        .then( () => this.respond( { body: { message: 'Great Job!' } } ) )

    },

    validate() {
        this.hasCCInfo = Boolean( this.body.payment.ccName && this.body.payment.ccNo && this.body.payment.ccMonth && this.body.payment.ccYear && this.body.payment.cvc )

        if( !this.hasCCInfo ) this.respond( { stopChain: true, code: 500, body: { message: 'Credit card information is required.' } } )
        
        this.total = Number.parseFloat( this.body.total )

        if( Number.isNaN( this.total ) ) return this.respond( { stopChain: true, code: 500, body: { message: 'Invalid Total.' } } )

        return Promise.resolve( this.validateTotal() )
    },

    validateTotal() {
        let price = 0

        this.body.recipients.forEach( recipient => price += Number.parseFloat( recipient.amount ) )

        if( price !== this.total ) return this.respond( { stopChain: true, code: 500, body: { message: `Doesn't add up.` } } )
    }

} )