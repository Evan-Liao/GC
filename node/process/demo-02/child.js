process.on('message', function (m, server) {
    if (m === 'server') {
        server.on('connetction', function(socket) {
            socket.end('handleed by child\n')
        })
    }
})