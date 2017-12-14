module.exports = {
    attributes: [
        require('./Name'),
        {
            name: 'street',
            label: 'Street',
            range: 'String'
        }, {
            name: 'cityStateZip',
            label: 'City/State/Zip',
            range: 'String'
        },
        require('./Email'),
        require('./Phone')
    ]
}