module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Shop'),

    events: {
        categories: 'click'
    },

    insertCategories() {
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