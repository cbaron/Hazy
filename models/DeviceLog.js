module.exports = {
    attributes: [
        {
            name: 'user',
            label: 'User',
            range: [
                {
                    name: 'id',
                    label: 'Id',
                    range: 'Integer'
                }, {
                    name: 'name',
                    label: 'Name',
                    range: 'String'
                }
            ]
        }, {
            fk: 'Device'
        }, {
            fk: 'DeviceAction'
        }, {
            name: 'denominations',
            label: 'Denominations',
            prompt: 'Enter the number present for each currency denomination.',
            range: [
                {
                    name: 'penny',
                    label: 'Penny',
                    range: 'Integer'
                },
                {
                    name: 'nickel',
                    label: 'Nickel',
                    range: 'Integer'
                },
                {
                    name: 'dime',
                    label: 'Dime',
                    range: 'Integer'
                },
                {
                    name: 'quarter',
                    label: 'Quarter',
                    range: 'Integer'
                },
                {
                    name: 'halfDollar',
                    label: 'Half-Dollar',
                    range: 'Integer'
                },
                {
                    name: 'dollar',
                    label: '$1',
                    range: 'Integer'
                },
                {
                    name: 'five',
                    label: '$5',
                    range: 'Integer'
                },
                {
                    name: 'ten',
                    label: '$10',
                    range: 'Integer'
                },
                {
                    name: 'twenty',
                    label: '$20',
                    range: 'Integer'
                },
                {
                    name: 'fifty',
                    label: '$50',
                    range: 'Integer'
                },
                {
                    name: 'oneHundred',
                    label: '$100',
                    range: 'Integer'
                },
            ]
        }, {
            name: 'total',
            label: 'Total',
            range: 'Integer'
        }, {
            name: 'createdAt',
            label: 'CreatedAt',
            range: 'DateTime'
        }
    ]
}