const Super = require('./__proto__')

module.exports = {
    attributes: Super.createAttributes( [ {
        fk: 'DiscType'
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
        label: 'HazySerial',
        name: 'hazySerial',
        range: 'String'
    }, {
        isNullable: false,
        label: 'Desription',
        name: 'description',
        range: 'Text'
    }, {
        isNullable: false,
        label: 'MFGFS',
        name: 'mfgfs',
        range: 'String'
    }, {
        isNullable: false,
        label: 'MFGFS',
        name: 'mfgfs',
        range: 'String'
    }, {
        name: 'runDate',
        label: 'Run Date',
        range: 'String'
    }, {
        name: 'manufactureLocation',
        label: 'Manufacturer Location',
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
        name: 'rimDepth',
        label: 'Rim Depth',
        range: 'String'
    }, {
        name: 'rimVAngle',
        label: 'Vertical Rim Angle',
        range: 'String'
    } ] )

}
