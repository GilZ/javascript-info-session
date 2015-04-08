var fs = require('fs');

fs.readFile('/tmp/large-file', function() {
    console.log('1')
});

console.log('2');