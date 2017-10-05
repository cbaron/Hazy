module.exports = {
    
    onMessage( data, messagingSocket ) {
        let parsedData = undefined;

        try { parsedData = JSON.parse( data ) } catch( e ) { console.log( data, e ); return }

        const type = parsedData.type

        if( typeof this[ type ] === 'function' ) this[ type ]( parsedData, data, messagingSocket )
    },

    send( socket, data ) { socket.send( JSON.stringify( data ) ) }
}
