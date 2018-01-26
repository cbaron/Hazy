db.createCollection("Device")
db.createCollection("DeviceLog")
db.createCollection("DeviceAction")

db.DeviceAction.insert( [
    {
        name: 'closeDevice',
        label: 'Close Device'
    },
    {
        name: 'safeDrop',
        label: 'Safe Drop'
    },
    {
        name: 'generalCashRemoval',
        label: 'General Cash Removal'
    }
] )