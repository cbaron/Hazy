module.exports = Object.create( {

    constructor() {
        this.range = document.createRange();
        this.range.selectNode(document.getElementsByTagName("div").item(0))
        return this
    },

    create( name, opts ) {
        const lower = name
        name = ( name.charAt(0).toUpperCase() + name.slice(1) ).replace( '-', '' )
        return Object.create(
            this.Views[ name ],
            Object.assign( {
                Dragger: { value: this.Dragger },
                Header: { value: this.Header },
                Toast: { value: this.Toast },
                name: { value: name },
                factory: { value: this },
                range: { value: this.range },
                template: { value: this.Templates[ name ] },
                user: { value: this.User }
            } )
        ).constructor( opts )
    },

}, {
    Dragger: { value: require('../views/Dragger') },
    Header: { value: require('../views/Header') },
    Templates: { value: require('../.TemplateMap') },
    Toast: { value: require('../views/Toast') },
    User: { value: require('../models/User') },
    Views: { value: require('../.ViewMap') }
} )
