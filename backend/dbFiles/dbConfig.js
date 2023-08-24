const config = {
    user: 'VoiceActors',
    password: 'loonVA',
    server: 'AlexPC',
    database: 'VADatabase',
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS'
    },
    port: 1433
}

module.exports = config;