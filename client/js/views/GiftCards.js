module.exports = Object.assign( {}, require('./Form'), {

    Views: {

        purchaseGiftCard() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/GiftCard').attributes
                } ),
                templateOptions() {
                    return {
                        disallowEnterKeySubmission: true
                    }
                }
                /*Views: {
                    creditCard() {
                        return {
                            model: require('../models/CreditCard'),
                            templateOptions() {
                                return {
                                    disallowEnterKeySubmission: true,
                                    hideButtonRow: true
                                }
                            }
                        }
                    }
                }*/
            }
        }

    }

} )