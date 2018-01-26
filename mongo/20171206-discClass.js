db.createCollection("Hat")
db.createCollection("DiscClass")

db.DiscClass.insert( [
    {
        name: 'driver',
        label: 'Driver'
    }, {
        name: 'mid-range',
        label: 'Mid-Range'
    }, {
        name: 'putter',
        label: 'Putter'
    }
] )