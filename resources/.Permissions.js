const AdminOnly = new Set( [ 'admin' ] )

module.exports = {

    Collection: {
        GET: AdminOnly,
        DELETE: AdminOnly,
        POST: AdminOnly
    },

    DiscType: {
        PUT: AdminOnly
    }
}
