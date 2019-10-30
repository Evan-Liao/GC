var fs = require('fs');
var babel = require('babel-core');
var demoPlugin = require('./plugin');

fs.readFile('index.js', function(err, data) {
    if (err) throw err;

    var src = data.toString();

    var out = babel.transform(src, {
        plugins: [
            [demoPlugin, {
                name: 'demo'
            }]
        ]
    })
    console.log('out', out.code)
})