module.exports = {
    mongodb: {
        url: 'mongodb://localhost/flashcard',
        options: {
            clustered: false
        }
    },
    server: {
        name: 'Flashcard-Development-Server',
        protocol: 'http',
        host: 'localhost',
        port: 9100,
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