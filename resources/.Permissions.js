const AdminOnly = new Set( [ 'admin' ] )

module.exports = {

    Collection: {
        GET: AdminOnly,
        DELETE: AdminOnly,
        POST: AdminOnly
    },

    DeviceLog: {
        GET: AdminOnly,
        DELETE: AdminOnly
    },

    Document: {
        PATCH: AdminOnly
    },

    DiscType: {
        DELETE: AdminOnly,
        PUT: AdminOnly
    }
}
