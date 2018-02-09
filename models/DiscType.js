const Super = require('./__proto__')

module.exports = {
    attributes: Super.createAttributes( [ {
        name: 'price',
        label: 'Price',
        range: 'Float'
    }, {
        fk: 'Vendor'
    }, {
        fk: 'DiscClass'
    }, {
        isNullable: false,
        label: 'Description',
        name: 'description',
        range: 'Text'
    }, {
        fk: 'PlasticType'
    }, {
        fk: 'PlaticTier'
    }, {
        name: 'plasticDesc',
        label: 'Plastic Description',
        range: 'String'
    }, {
        name: 'rimDepth',
        label: 'Rim Depth',
        range: 'String'
    }, {
        name: 'rimVAngle',
        label: 'Vertical Rim Angle',
        range: 'String'
    }, {
        label: 'Flight',
        name: 'flight',
        range: [ {
            name: 'speed',
            label: 'Speed',
            range: 'Integer'
        }, {
            name: 'glide',
            label: 'Glide',
            range: 'Integer'
        }, {
            name: 'turn',
            label: 'Turn',
            range: 'Integer'
        }, {
            name: 'fade',
            label: 'Fade',
            range: 'Integer'
        } ]
    }, {
        name: 'mold',
        label: 'Mold',
        range: 'String'
    }, {
        fk: 'Manufacturer'
    }, {
        name: 'patent',
        label: 'Patent',
        range: 'String'
    } ] )
}