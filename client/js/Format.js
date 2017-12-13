module.exports = {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    GetFormField( datum, value, meta ) {
        const isNested = datum.range === 'List' || typeof datum.range === 'object'

        const image = datum.range === 'ImageUrl'
            ? `<div><button class="btn" data-js="previewBtn" type="button">Preview</button><img data-src="${this.ImageSrc( value )}" /></div>`
            : ``
                           
        const options = datum.metadata ? datum.metadata.options : false

        const icon = datum.metadata
            ? datum.metadata.icon
                ? this.GetIcon( datum.metadata.icon )
                : options
                    ? this.GetIcon('caret-down')
                    : ``
            : ``

        value = ( value === undefined ) ? '' : value

        if( options ) {
            if( typeof options === 'function' ) { options(); return this.GetSelect( datum, value, [ ], icon ) }
            else if( Array.isArray( options ) ) return this.GetSelect( datum, value, options, icon )
        }
            
        const label = isNested || ( datum.fk || datum.label && !meta.noLabel )
            ? `<label>${datum.fk || datum.label}</label>`
            : ``

        const prompt = datum.prompt ? `<div class="prompt">${datum.prompt}</div>` : ``

        const input = datum.fk
            ? `<div data-view="typeAhead" data-name="${datum.fk}"></div>`
            : datum.range === 'Text'
                ? `<textarea data-js="${datum.name}" placeholder="${datum.label || ''}" rows="3">${value}</textarea>`
                : datum.range === 'List' || datum.range === 'View' || typeof datum.range === 'object'
                    ? `<div data-js="${datum.name}" data-name="${datum.name}"></div>`
                    : `<input type="${this.RangeToInputType[ datum.range ]}" data-js="${datum.name}" placeholder="${datum.label || ''}" value="${value}" />`

        return `` +
        `<div class="form-group ${isNested ? 'nested' : ''}">
            ${label}
            ${prompt}
            ${input} 
            ${icon}
        </div>`
    },

    GetFormFields( data, model={}, meta ) {
        if( !data ) return ``

        return data.map( datum => this.GetFormField( datum, model && model[ datum.name ], meta ) ).join('')
    },

    GetIcon( name, opts={ } ) { 
        opts = Object.assign( { IconDataJs: this.IconDataJs, name }, opts )
        return Reflect.apply( this.Icons[ name ], this, [ opts ] )
    },

    GetListItems( items=[], opts={} ) {
        return items.map( item => {
            const attr = opts.dataAttr ? `data-${opts.dataAttr}="${item[ opts.dataAttr ]}"` : ``
            return `<li ${attr}>${item.label || item}</li>` 
        } ).join('')
    },

    GetSelect( datum, selectedValue, optionsData, icon ) {
        const options = optionsData.length ? this.GetSelectOptions( optionsData, selectedValue, { valueAttr: 'name' } ) : ``

        return `` +
        `<div class="form-group">
            <select data-js="${datum.name}">
                <option ${!selectedValue ? `selected` : ``} value>${datum.label}</option>
                ${options}
            </select>
            ${icon}
        </div>`
    },

    GetSelectOptions( options=[], selectedValue, opts={ valueAttr: 'value' } ) {
        return options.map( option => `<option ${selectedValue === option[ opts.valueAttr ] ? `selected` : ``} value="${option[ opts.valueAttr ]}">${option.label}</option>` ).join('')
    },

    Icons: require('./.IconMap'),
    
    IconDataJs( p ) { return p.name ? `data-js="${p.name}"` : `` },

    ImageSrc( name ) { return `https://storage.googleapis.com/mega-poetry-9665/${name}` },

    Range( int ) {
        return Array.from( Array( int ).keys() )
    },

    RangeToInputType: {
        Email: 'email',
        Password: 'password',
        String: 'text'
    }

}
