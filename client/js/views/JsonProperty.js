module.exports = Object.assign( { }, require('./__proto__'), {

    Views: {

        Literal() {
            return {
                model: { data: this.model.data.value, meta: { editable: this.model.isEditable( this.model.data.key ) } }
            }
        },

        buttonFlow() {
            return {
                model: {
                    data: {
                        states: { 
                            start: [
                                { name: 'delete', svg: this.Format.getIcon( 'garbage', { name: 'delete' } ), nextState: 'confirmDelete', emit: true }
                            ],
                            confirmDelete: [
                                { name: 'doDelete', class: 'link', text: 'Delete?', emit: true, nextState: 'start' },
                                { name: 'cancel', svg: require('./templates/lib/ex')( { name: 'cancel' } ), nextState: 'start', emit: true }
                            ]
                        }
                    }
                }
            }
        }

    },

    getTemplateOptions() {
        return {
            viewName: Array.isArray( this.model.data.value )
                ? 'Array'
                : typeof this.model.data.value === 'object'
                    ? 'Json'
                    : 'Literal',

            isEditable: this.model.isEditable( this.model.data.key ),

            model: this.model.data
        }
    },

    postRender() {
        if( !this.model.isEditable( this.model.data.key ) ) { this.views.buttonFlow.disable(); return this; }

        this.views.buttonFlow.on( 'doDeleteClicked', this.delete.bind(this) )
        
        this.views.buttonFlow.on( 'deleteClicked', () => this.els.container.classList.add('confirm-delete') )
        this.views.buttonFlow.on( 'cancelClicked', () => this.els.container.classList.remove('confirm-delete') )

        return this
    }

} )

