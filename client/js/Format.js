module.exports = {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    GetFormField( datum, value, meta ) {

        const icon = datum.metadata
            ? datum.metadata.icon
                ? this.Icons[ datum.metadata.icon ]
                : ``
            : ``

        const image = datum.range === 'ImageUrl'
            ? `<div><button class="btn" data-js="previewBtn" type="button">Preview</button><img data-src="${this.ImageSrc( value )}" /></div>`
            : ``
                           
        const options = datum.metadata ? datum.metadata.options : false

        value = ( value === undefined ) ? '' : value

        if( options ) {
            if( typeof options === 'function' ) { options(); return this.GetSelect( datum, value, [ ], icon ) }
            else if( Array.isArray( options ) ) return this.GetSelect( datum, value, options, icon )
        }
            
        const label = 
            datum.fk || datum.label && !meta.noLabel
                ? `<label>${datum.fk || datum.label}</label>`
                : ``

        const input = datum.fk
            ? `<div data-view="typeAhead" data-name="${datum.fk}"></div>`
            : datum.range === 'Text'
                ? `<textarea data-js="${datum.name}" placeholder="${datum.label || ''}" rows="3">${value}</textarea>`
                : datum.range === 'List' || typeof datum.range === 'object'
                    ? `<div data-js="${datum.name}" data-name="${datum.name}"></div>`
                    : `<input type="${this.RangeToInputType[ datum.range ]}" data-js="${datum.name}" placeholder="${datum.label || ''}" value="${value}" />`

        return `` +
        `<div class="form-group">
            ${label}
            ${input} 
            ${icon}
        </div>`
    },

    GetFormFields( data, model={}, meta ) {
        console.log( 'GetFormFields' )
        console.log( model.meta )
        if( !data ) return ``

        return data.map( datum => this.GetFormField( datum, model && model[ datum.name ], meta ) ).join('')
    },

    GetIcon( name, opts={ IconDataJs: this.IconDataJs } ) { return Reflect.apply( this.Icons[ name ], this, [ opts ] ) },

    GetListItems( items=[], opts={} ) {
        return items.map( item => {
            const attr = opts.dataAttr ? `data-${opts.dataAttr}="${item[ opts.dataAttr ]}"` : ``
            return `<li ${attr}>${item.label || item}</li>` 
        } ).join('')
    },

    GetSelect( datum, selectedValue, optionsData, icon ) {
        console.log( 'GetSelect' )
        console.log( datum )
        console.log( selectedValue )
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
        console.log( 'GetSelectOptions' )
        console.log( options )
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
