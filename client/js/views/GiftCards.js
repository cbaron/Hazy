module.exports = Object.assign( {}, require('./Form'), {

    Views: {

        purchaseGiftCard() {
            return {
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/GiftCardTransaction').attributes,
                    heading: 'Contact Info',
                    meta: { noLabel: true },
                    resource: 'GiftCardTransaction'
                } ),
                templateOptions() {
                    return {
                        disallowEnterKeySubmission: true
                    }
                }
            }
        }

    }

} )