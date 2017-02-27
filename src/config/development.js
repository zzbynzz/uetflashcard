module.exports = {
    mongodb: {
        url: 'mongodb://root:root@ds161209.mlab.com:61209/flashcard',
        options: {
            clustered: false
        }
    },
    server: {
        name: 'Flashcard-Development-Server',
        protocol: 'http',
        host: 'localhost',
        port: process.env.PORT || '3000',
        requestExpiry: {header: 'x-request-expiry-time'},
        throttle: {
            burst: 100,
            rate: 50,
            ip: true,
            overrides: {
                '192.168.1.1': {
                    rate: 0,        // unlimited
                    burst: 0
                }
            }
        }
    }
}