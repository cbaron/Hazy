module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/Shop'),

    insertCategories() {
        console.log( this.model )
        console.log( this.model.git('colllections') )
        console.log( this.Format.GetListItems( this.model.git('colllections'), { dataAttr: 'name' } ) )
        this.slurpTemplate( {
            insertion: { el: this.els.categories },
            template: this.Format.GetListItems( this.model.git('colllections'), { dataAttr: 'name' } )
        } )
    },

    postRender() {
        this.insertCategories()

        return this
    }

} )