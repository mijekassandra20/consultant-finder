var Service = require('node-windows').Service;

var svc = new Service({
    name: 'Consultant_Finder',
    description: 'Consultant Finder Application server',
    script: 'C:\\Users\\SZ-Agent\\Desktop\\Projects\\FINAL_QB\\query_builder\\server\\server.js',
});

svc.on('install', function () { svc.start() })

svc.install();