const Super = require('./__proto__')

module.exports = {
    attributes: Super.createAttributes( [ {
        fk: 'DiscType'
    }, {
        name: 'price',
        label: 'Price',
        range: 'Float'
    }, {
        name: 'isSold',
        label: 'Is Sold',
        range: 'Boolean'
    }, {
        isNullable: false,
        itemRange: 'String',
        label: 'Photo Urls',
        name: 'PhotoUrls',
        range: 'List'
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
        isNullable: false,
        label: 'Description',
        name: 'description',
        range: 'Text'
    }, {
        name: 'runDate',
        label: 'Run Date',
        range: 'String'
    }, {
        name: 'quality',
        label: 'Quality',
        range: 'String'
    }, {
        name: 'discHistory',
        label: 'Disc History',
        range: 'Text'
    }, {
        name: 'plh',
        label: 'PLH',
        range: 'String'
    }, {
        fk: 'StampType'
    }, {
        name: 'sellOnline',
        label: 'Sell Online',
        range: 'Boolean'
    }, {
        name: 'createdAt',
        label: 'Created At',
        range: 'Datetime'
    }, {
        name: 'isUsed',
        label: 'Is Used',
        range: 'Boolean'
    } ] )

}
