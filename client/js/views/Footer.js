module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.on( 'imgLoaded', el => {
            if( !el.parentNode ) return
            el.parentNode.nextElementSibling.classList.remove('hidden')
        } )

        return this
    }

} )
