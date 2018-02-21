module.exports = {
    attributes: [ {
        fk: 'DiscType',
        error: 'DiscType is a required field'
    }, {
        isNullable: false,
        label: 'Weight',
        name: 'weight',
        range: 'Integer'
    }, {
        isNullable: false,
        label: 'Color',
        name: 'color',
        range: 'String'
    }, {
        name: 'plh',
        label: 'PLH',
        range: 'String'
    }, {
        isNullable: false,
        itemRange: 'ImageUrl',
        label: 'Photo Urls',
        name: 'PhotoUrls',
        range: 'List'
    }, {
        name: 'cost',
        label: 'Cost',
        range: 'Float',
        error: 'Cost is a required field'
    }, {
        name: 'price',
        label: 'Price',
        range: 'Float',
        error: 'Price is a required field'
    }, {
        name: 'isSold',
        label: 'Is Sold',
        default: 'false',
        range: 'Boolean'
    }, {
        name: 'sellOnline',
        label: 'Sell Online',
        default: 'true',
        range: 'Boolean'
    }, {
        name: 'isUsed',
        label: 'Is Used',
        default: 'false',
        range: 'Boolean'
    }, {
        fk: 'StampType',
        default: 'stock'
    }, {
        name: 'createdAt',
        label: 'Created At',
        range: 'Datetime'
    }, {
        name: 'runDate',
        label: 'Run Date',
        range: 'String'
    }, {
        name: 'discHistory',
        label: 'Disc History',
        range: 'Text'
    } ]

}
