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
        metadata: {
            options: [
                { name: '1', label: '01' },
                { name: '2', label: '02' },
                { name: '3', label: '03' },
                { name: '4', label: '04' },
                { name: '5', label: '05' },
                { name: '6', label: '06' },
                { name: '7', label: '07' },
                { name: '8', label: '08' },
                { name: '9', label: '09' },
                { name: '10', label: '10' },
                { name: '11', label: '11' },
                { name: '12', label: '12' }
            ]
        },
        range: 'String',
        error: 'A credit card month expiration is required'
    }, {
        name: 'ccYear',
        label: 'YR',
        metadata: {
            options: [
                { name: '2017', label: '2017' },
                { name: '2018', label: '2018' },
                { name: '2019', label: '2019' },
                { name: '2020', label: '2020' },
                { name: '2021', label: '2021' },
                { name: '2022', label: '2022' },
                { name: '2023', label: '2023' }
            ]
        },
        range: 'String',
        error: 'A credit card year expiration is required'
    }, {
        name: 'cvc',
        label: 'CVC',
        range: 'String',
        error: 'A credit card cvc is required'
    } ]
}