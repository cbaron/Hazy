const AdminOnly = new Set( [ 'admin' ] )
module.exports = {

    Collection: {
        GET: AdminOnly,
        POST: AdminOnly
    },

    DiscType: {
        PUT: AdminOnly
    }
}
