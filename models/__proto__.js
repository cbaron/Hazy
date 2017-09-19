module.exports = {

    Attributes: [ {
        label: 'Label',
        name: 'label',
        range: 'String'
    }, {
        label: 'Name',
        name: 'name',
        range: 'String',
        validate: val => ( ! /\s/.test( val ) ) && ( value.match(/^[A-Z]*$/) )
    } ],

    createAttributes( attributes ) { return this.Attributes.concat( attributes ) },

    create() { return { attributes: this.Attributes } }
}
