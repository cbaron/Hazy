module.exports = {
    name: 'email',
    label: 'Email',
    range: 'Email',
    error: 'A valid email address is required',
    validate: function( val ) { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( val ) }
}