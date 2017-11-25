module.exports = {
    attributes: [ {
        name: 'ccName',
        label: 'Name on Card',
        range: 'String',
        error: 'A credit card name is required'
    }, {
        name: 'ccNo',
        label: 'Number on Card',
        range: 'String',
        error: 'A credit card number is required'
    }, {
        name: 'ccMonth',
        label: 'MO',
        range: 'String',
        error: 'A credit card month expiration is required'
    }, {
        name: 'ccYear',
        label: 'YR',
        range: 'String',
        error: 'A credit card year expiration is required'
    }, {
        name: 'cvc',
        label: 'CVC',
        range: 'String',
        error: 'A credit card cvc is required'
    } ]
}