module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Shop'),

    events: {
        categories: 'click'
    },

    insertCategories() {
        console.log( this.model )
        console.log( this.model.git )
        console.log( this.model.data )
        console.log( this.model.git('collections') )
        console.log( this.Format.GetListItems( this.model.git('collections'), { dataAttr: 'name' } ) )
        this.slurpTemplate( {
            insertion: { el: this.els.categories },
            template: this.Format.GetListItems( this.model.git('collections'), { dataAttr: 'name' } )
        } )
    },

    onCategoriesClick( e ) {
        if( e.target.tagName !== 'LI' ) return
        this.emit( 'navigate', `/shop/${e.target.getAttribute('data-name')}` )
    },

    postRender() {
        this.insertCategories()

        return this
    }

} )