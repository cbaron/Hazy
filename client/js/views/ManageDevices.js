module.exports = Object.assign( { }, require('./__proto__'), {
    
    Device: Object.create( require('../models/__proto__'), { resource: { value: 'Device' } } ),
    DeviceAction: Object.create( require('../models/__proto__'), { resource: { value: 'DeviceAction' } } ),

    Templates: {
        Device: require('./templates/Device')
    },

    Views: {
        devices() {
            return {
                events: { action: 'change' },
                model: Object.create( this.Model ).constructor( {
                    collection: Object.create( this.Model ).constructor( [ ], { resource: 'Device', meta: { key: 'name' } } )
                } ),
                itemTemplate: ( datum, format ) => this.Templates.Device( Object.assign( datum, format, { actionData: this.DeviceAction.data } ) ),
                onActionChange( e ) { this.emit( 'actionChosen', e ) },
                templateOptions() {
                    return { name: 'Devices' }
                }
            }
        },
        deviceLog() {
            return {
                events: { cancelBtn: 'click' },
                model: Object.create( this.Model ).constructor( { }, {
                    attributes: require('../../../models/DeviceLog').attributes,
                    data: {
                        total: 0,
                        user: { id: this.user.git('id'), name: this.user.git('name') }
                    },
                    meta: {
                        user: { hide: true },
                        Device: { hide: true },
                        DeviceAction: { hide: true },
                        createdAt: { hide: true },
                        total: { hide: true },
                        denominationValues: {
                            penny: .01,
                            nickel: .05,
                            dime: .1,
                            quarter: .25,
                            halfDollar: .5,
                            dollar: 1,
                            five: 5,
                            ten: 10,
                            twenty: 20,
                            fifty: 50,
                            oneHundred: 100
                        }
                    },
                    resource: 'DeviceLog'
                } ),
                templateOptions() {
                    return {
                        displayTotal: true,
                        heading: 'Log action for device'
                    }
                },
                onCancelBtnClick() { this.emit('cancelClicked') },
                toastSuccess: 'Device log added.'
            }
        }
    },

    events: {
        views: {
            devices: [
                [ 'actionChosen', function( e ) { this.onActionChosen( e ) } ]
            ],
            deviceLog: [
                [ 'cancelClicked', function() { this.reset() } ],
                [ 'posted', function() { this.reset() } ]
            ]
        }
    },

    onActionChosen( e ) {
        const listEl = e.target.closest('li')
        if( !listEl ) return

        this.selectBox = e.target

        const actionDatum = this.DeviceAction.store.name[ e.target.value ],
            deviceDatum = this.Device.store.name[ listEl.getAttribute('data-key') ]

        this.toggleTotalVisibility( actionDatum.name )

        this.views.deviceLog.els.heading.textContent = `${deviceDatum.label}: ${actionDatum.label}`

        this.views.deviceLog.model.set( 'Device', deviceDatum._id )
        this.views.deviceLog.model.set( 'DeviceAction', actionDatum._id )

        return this.views.devices.hide().then( () => this.views.deviceLog.show() ).catch( this.Error )
    },

    postRender() {
        Promise.all( [ this.Device.get( { storeBy: [ 'name' ] } ), this.DeviceAction.get( { storeBy: [ 'name' ] } ) ] )
        .then( () => this.views.devices.fetch() )
        .catch( this.Error )

        this.views.deviceLog.model.on( 'totalChanged', () =>
            this.views.deviceLog.els.total.textContent = this.Format.Currency.format( this.views.deviceLog.model.git('total') )
        )

        this.denominations = this.views.deviceLog.views.denominations
        this.denominationValues = this.views.deviceLog.model.meta.denominationValues

        Object.keys( this.denominations.els ).forEach( key => {
            if( this.denominationValues[ key ] ) this.denominations.els[ key ].addEventListener( 'input', () => this.updateTotal() )
        } )

        return this
    },

    reset() {
        return this.views.deviceLog.hide()
        .then( () => {
            this.selectBox.selectedIndex = 0
            this.views.deviceLog.clear()
            this.views.deviceLog.model.data = { user: { id: this.user.git('id'), name: this.user.git('name') } }
            this.views.deviceLog.model.set( 'total', 0 )
            return this.views.devices.show()
        } )
        .catch( this.Error )
    },

    toggleTotalVisibility( action ) { this.views.deviceLog.els.total.parentNode.classList.toggle( 'hidden', action === 'closeDevice' ) },

    updateTotal() {
        const total = Object.keys( this.denominationValues ).reduce( ( memo, key ) => {
            const el = this.denominations.els[ key ]
            if( el.value ) memo += ( window.parseInt( el.value ) * this.denominationValues[ key ] )
            return memo
        }, 0 )

        this.views.deviceLog.model.set( 'total', total )
    }

} )