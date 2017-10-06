module.exports = Object.assign( { }, require('./__proto__'), {

    Byop: Object.create( require('../models/Byop') ),
    
    Divisions: Object.create( require('../models/__proto__'), { resource: { value: 'division' } } ),

    Views: {

        byopTeamEdit: { model: { data: {
            disabled: true,
            states: { 
                start: [
                    { name: 'updateByopTeam', class: '', text: 'Save', nextState: 'confirm' },
                    { name: 'cancelUpdate', class: '', text: 'Cancel', nextState: 'start', emit: true }
                ],
                confirm: [
                    { name: 'confirmUpdate', class: '', text: 'Are you Sure?', emit: true, nextState: 'start' },
                    { name: 'cancel', class: '', nextState: 'start', text: 'Cancel', emit: true }
                ]
            }
        } } },

        typeAhead: {
            templateOptions: { label: 'Search Byop 2017 by player name' }
        }

    },

    addChange( name ) {
        this.slurpTemplate( {
            template: `<div data-name="${name}">${this.getChangeText( name )}</div>`,
            insertion: { el: this.els.changes }
        } )
        this.changes[ name ] = true
    },

    addDivisions() {
        this.Divisions.data.forEach( division => this.slurpTemplate( { template: `<option value="${division.id}">${division.label}</option>`, insertion: { el: this.els.divisionId } } ) )

        return Promise.resolve()
    },

    events: {
        heading: 'click'
    },

    reset() {
        this.changes = { }
        while( this.els.changes.firstChild ) this.els.changes.removeChild( this.els.changes.firstChild )
        this.populateByopForm()
        this.updateByopButtons()
    },

    getChangeText( name ) {
        const from = this.Byop.attributes[ name ].type === 'select'
            ? this.els[ name ].querySelector( `option[value="${this.Byop.data[ name ]}"]` ).innerText
            : this.Byop.data[ name ]

        const to = this.Byop.attributes[ name ].type === 'select'
            ? this.els[ name ].querySelector( `option[value="${this.els[ name ].value}"]` ).innerText
            : this.els[ name ].value

        return `${this.Byop.attributes[ name ].label} changed from ${from} to ${to}.`
    },

    onHeadingClick() { this.els.content.classList.contains('hidden') ? this.showEl( this.els.content ) : this.hideEl( this.els.content ) },
        
    onPatchingByop() {
        this.patchingByop = true
        this.views.byopTeamEdit.toggle( 'confirmUpdate', 'patching', this.patchingByop )
    },
    
    onPatchingByopDone() {
        this.patchingByop = false
        this.views.byopTeamEdit.toggle( 'confirmUpdate', 'patching', this.patchingByop )
    },

    patchByop() {
        if( this.patchingByop ) return

        this.onPatchingByop()

        const payload = Object.keys( this.changes ).reduce( ( memo, key ) => {
            const el = this.els[key],
                name = el.getAttribute('data-name')
            return Object.assign( memo, { [ name ]: this.Byop.attributes[ name ].range === "Boolean" ? Boolean( el.value === "true" ) : el.value } )
        }, { } )

        this.Byop.patch( this.Byop.data.id, payload )
        .then( result => {
            this.reset()
            this.onPatchingByopDone()
            return this.Toast.createMessage( 'success', 'Record updated.' ).catch( this.Error )
        } )
        .catch( e => {
            this.Toast.createMessage( 'error', `Something went wrong.  Try again, or email Mike Baron's brother.` ).catch( this.Error )
            this.onPatchingByopDone()
        } )
    },

    populateByopForm() {
        Object.keys( this.Byop.data ).forEach( attr => {
            const el = this.els[ attr ]

            if( !el ) return

            const elAttr = [ 'INPUT', 'SELECT' ].includes( el.tagName ) ? 'value' : 'textContent'
            el[ elAttr ] = this.Byop.data[ attr ].toString()

            el.classList.remove('changed')
        } )

        if( Object.keys( this.Byop.data ).length === 0 ) return this.hideEl( this.els.selectedTeam )
        
        this.showEl( this.els.selectedTeam ).catch( e => this.Error )
    },

    postRender() {

        this.changes = { }

        this.Divisions.get()
        .then( () => this.addDivisions() )
        .catch( e => this.Error(e) )
        
        this.views.typeAhead.on( 'teamSelected', team => {
            this.Byop.data = team
            this.reset()
        } )
        
        this.views.typeAhead.on( 'cleared', () => { this.Byop.data = { }; this.reset() } )

        this.views.byopTeamEdit.on( 'cancelUpdateClicked', () => this.reset() )
        this.views.byopTeamEdit.on( 'cancelClicked', () => this.reset() )
        this.views.byopTeamEdit.on( 'confirmUpdateClicked', () => this.patchByop() )

        this.$( this.els.selectedTeam, 'input,select' ).forEach( el => el.addEventListener( 'blur', e => this.onByopInputBlur( e ) ) )
        return this
    },

    onByopInputBlur( e ) {
        const el = e.target,
            name = el.getAttribute('data-name'),
            modelValue = this.Byop.data[ name ],
            hasChanged = Boolean( ( typeof modelValue === 'string' ? modelValue.trim() : modelValue ) != ( this.Byop.attributes[ name ].range === "Boolean" ? Boolean( el.value === "true" ) : el.value.trim() ) )
       
        el.classList.toggle( 'changed', hasChanged )

        if( hasChanged && this.changes[ name ] === undefined ) this.addChange( name )
        else if( hasChanged && this.changes[ name ] !== undefined ) this.updateChange( name )
        else if( !hasChanged && this.changes[ name ] !== undefined ) this.removeChange( name )

        this.updateByopButtons()
    },
     
    removeChange( name ) {
        this.els.changes.removeChild( this.els.changes.querySelector( `div[data-name="${name}"]` ) )
        delete this.changes[ name ]
    },

    templateOptions() {
        return { byopAttributes: this.Byop.attributes, byopKeys: Object.keys( this.Byop.attributes ), byopMeta: this.Byop.meta }
    },

    updateByopButtons() {
        this.views.byopTeamEdit[ Object.keys( this.changes ).length ? 'enable' : 'disable' ]()
    },

    updateChange( name ) {
        this.els.changes.querySelector( `div[data-name="${name}"]` ).textContent = this.getChangeText( name )
        this.changes[ name ] = true
        
    }
    
} )
