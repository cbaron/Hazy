module.exports = Object.assign( { }, require('./__proto__'), {

    apply( method ) {
        return this.getUser()
        .then( () => this.validateUser() )
        .then( () => this[ method ]() )
    },

    DELETE() {
        return this.Mysql.deleteDiscFromPos( this.path[1] )
    },

    PATCH() {
        return this.slurpBody()
        .then( () => {
            const disc = this.body.disc,
                discType = this.body.discType,
                data = {
                    name: discType.label,
                    category: 'Discs',
                    supplier_id: discType.Manufacturer,
                    item_number: disc._id,
                    description: discType.description ? discType.description.slice(0,254) : 'no description',
                    cost_price: disc.cost,
                    unit_price: disc.price,
                    custom1: disc.weight,
                    custom2: disc.color
                }

            return this.Mysql.updateDiscOnPos( data, { item_number: disc._id } )
        } )
        .then( () => this.respond( { body: { } } ) )
    },

    POST() {
        return this.slurpBody()
        .then( () => {
            const disc = this.body.disc,
                discType = this.body.discType,
                data = {
                    name: discType.label,
                    category: 'Discs',
                    supplier_id: discType.Manufacturer,
                    item_number: disc._id,
                    description: discType.description ? discType.description.slice(0,254) : 'no description',
                    cost_price: disc.cost,
                    unit_price: disc.price,
                    reorder_level: 0,
                    receiving_quantity: 1,
                    allow_alt_description: 1,
                    is_serialized: 1,
                    stock_type: 1,
                    item_type: 1,
                    tax_category_id: 1,
                    deleted: 0,
                    custom1: disc.weight,
                    custom2: disc.color
                }

            return this.Mysql.addDiscOnPos( data )
        } )
        .then( () => this.respond( { body: { } } ) )
    }

} )