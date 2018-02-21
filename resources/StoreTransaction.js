module.exports = Object.assign( { }, require('./__proto__'), {

    Stripe: require('./lib/Stripe'),

    email: require('../lib/Email'),

    POST() {
        return this.getUser()
        .then( () => this.slurpBody() )
        .then( () => this.validate() )
        .then( () => {
            this.payment = this.body.payment
            this.body = this.omit( this.body, [ 'payment', 'total' ] )

            return this.Mongo.POST( this )
        } )
        .then( ( [ { _id } ] ) => this.pay( _id ) )
    },

    pay( transactionId ) {
        return this.Stripe.charge( {
            amount: Math.floor( this.total * 100 ),
            metadata: { transactionId: transactionId.toString(), name: this.body.shipping.name },
            receipt_email: this.body.shipping.email,
            source: {
                exp_month: this.payment.ccMonth,
                exp_year: this.payment.ccYear,
                number: this.payment.ccNo,
                object: 'card',
                cvc: this.payment.cvc
            },
            statement_descriptor: 'HazyShade Store'
        } )
        .catch( e => {
            console.log( e.stack || e )

            return this.Mongo.DELETE( this, transactionId )
            .then( () => this.respond( { stopChain: true, code: 500, body: { message: 'Error processing payment. Please try again.' } } ) )
        } )
        .then( charge => {
            this.body.shoppingCart = this.body.shoppingCart.map( item => Object.assign( item, { isSold: true } ) )
            Object.assign( this.body, { stripeChargeId: charge.id } )

            return this.Mongo.PUT( this, transactionId )
        } )
        .then( () => this.updateSoldItems() )
        .then( () => this.respond( { body: { message: 'Great Job!' } } ) )

    },

    updateSoldItems() {
        return Promise.all( this.body.shoppingCart.map( item =>
            this.Mongo.getDb().then( db => db.collection( item.collectionName ).findOneAndUpdate(
                { _id: this.Mongo.ObjectId( item._id ) },
                { $set: { isSold: 'true' } }
            ) )
            .then( () => this.Mysql.deleteDiscFromPos( item._id ) )
        ) )
    },

    validate() {
        this.hasCCInfo = Boolean( this.body.payment.ccName && this.body.payment.ccNo && this.body.payment.ccMonth && this.body.payment.ccYear && this.body.payment.cvc )

        if( !this.hasCCInfo ) this.respond( { stopChain: true, code: 500, body: { message: 'Credit card information is required.' } } )
        
        this.total = Number.parseFloat( this.body.total )

        if( Number.isNaN( this.total ) ) return this.respond( { stopChain: true, code: 500, body: { message: 'Invalid Total.' } } )

        this.validateTotal()

        return Promise.resolve( this.validateCart() )
    },

    validateCart() {
        this.body.shoppingCart.forEach( item => {
            if( item.isSold === "true" ) return this.respond( { stopChain: true, code: 500, body: { item, message: `${item.label} is no longer available. It has been removed from you cart` } } )
        } )
    },

    validateTotal() {
        let price = 0

        this.body.shoppingCart.forEach( item => price += Number.parseFloat( item.price ) )

        if( price !== this.total ) return this.respond( { stopChain: true, code: 500, body: { message: `Doesn't add up.` } } )
    }

} )