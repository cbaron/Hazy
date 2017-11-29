module.exports = {
    name: 'phone',
    label: 'Phone Number',
    range: 'String',
    error: 'A valid phone number is required',
    validate: function( val ) { return /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/.test( val ) }
}