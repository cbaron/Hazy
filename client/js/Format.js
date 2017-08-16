module.exports = {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    GetFormFields( data ) {
        return data.map( datum => {
            const icon = datum.metadata.icon ? this.Icons[ datum.metadata.icon ] : ``,
                options = datum.metadata.options

            if( options ) {
                if( typeof options === 'function' ) { options(); return this.GetSelect( datum, [ ], icon ) }
                else if( Array.isArray( options ) ) return this.GetSelect( datum, options, icon )
            }

            return `` +
            `<div class="form-group">
                <input type="${this.RangeToInputType[ datum.Range ]}" data-js="${datum.name}" placeholder="${datum.label}" />
                ${icon}
            </div>`
        } ).join('')
    },

    GetListItems( items=[], opts={} ) {
        return items.map( item => {
            const attr = opts.dataAttr ? `data-${opts.dataAttr}="${item[ opts.dataAttr ]}"` : ``
            return `<li ${attr}>${item.label}</li>` 
        } ).join('')
    },

    GetSelect( datum, optionsData, icon ) {
        const options = optionsData.length ? this.GetSelectOptions( optionsData, { valueAttr: 'name' } ) : ``

        return `` +
        `<div class="form-group">
            <select data-js="${datum.name}">
                <option selected value>${datum.label}</option>
                ${options}
            </select>
            ${icon}
        </div>`
    },

    GetSelectOptions( options=[], opts={ valueAttr: 'value' } ) {
        return options.map( option => `<option value="${option[ opts.valueAttr ]}">${option.label}</option>` ).join('')
    },
    
    Icons: require('./.IconMap'),

    ImageSrc( name ) { return `https://storage.googleapis.com/mega-poetry-9665/${name}` },

    Range( int ) {
        return Array.from( Array( int ).keys() )
    },

    RangeToInputType: {
        Text: 'text',
        Email: 'email',
        Password: 'password'
    }
}
