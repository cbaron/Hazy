module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        closeBtn: 'click',
        viewCartBtn: 'click'
    },

    onCloseBtnClick() { this.hide().catch( this.Error ) },

    onViewCartBtnClick() {
        this.hide()
        .then( () => this.emit('viewCartClicked') )
        .catch( this.Error )
    },

    update( item, typeDatum ) {
        this.addedItem = item

        this.els.itemImage.src = this.Format.ImageSrc( item.PhotoUrls[0] )
        this.els.label.textContent = item.label
        this.els.manufacturer.textContent = typeDatum.Manufacturer
        this.els.price.textContent = this.Format.Currency.format( item.price )

        this.els.subtotal.textContent = `Subtotal: ${this.user.meta.subtotal}`
        this.els.cartCount.textContent = `Number of items in cart: ${this.user.git('cart').length}`

        return this
    }

} )