module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.on( 'imgLoaded', el => el.nextElementSibling.classList.remove('hidden') )

        return this
    }

} )
