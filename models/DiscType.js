module.exports = {
    attributes: [ {
        fk: true,
        name: 'Vendor'
    }, {
        fk: true,
        name: 'PlasticType'
    }, {
        isNullable: false,
        label: 'HazySerial',
        name: 'hazySerial',
        range: 'Text'
    }, {
        isNullable: false,
        label: 'Desription',
        name: 'description',
        range: 'Text'
    }, {
        label: 'Flight',
        name: 'flight',
        range: [ {
            name: 'speed',
            label: 'Speed',
            range: 'Integer'
        }, {
            name: 'fade',
            label: 'Fade',
            range: 'Integer'
        }, {
            name: 'glide',
            label: 'Glide',
            range: 'Integer'
        }, {
            name: 'turn',
            label: 'Turn',
            range: 'Integer'
        } ]
    }, {
        name: 'mold',
        label: 'Mold',
        range: 'Text'
    }, {
        name: 'runDate',
        label: 'Run Date',
        range: 'Text'
    }, {
        fk: true,
        name: 'Manufacturer'
    }, {
        name: 'manufactureLocation',
        label: 'Manufacturer Location',
        range: 'Text'
    }, {
        name: 'patent',
        label: 'Patent',
        range: 'Text'
    } ]
}
