const AdminOnly = new Set( [ 'admin' ] )

module.exports = {

    Collection: {
        GET: AdminOnly,
        DELETE: AdminOnly,
        POST: AdminOnly
    },

    DiscType: {
        DELETE: AdminOnly,
        PUT: AdminOnly
    }
}
