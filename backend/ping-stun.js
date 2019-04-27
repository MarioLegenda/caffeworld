const fs = require('fs');
const ping = require('ping');

fs.readFile('public-stun-list.txt', 'utf-8', (err, list) => {
    if (err) throw new Error(err.message);

    list.split(/\s+/).forEach((value, key) => {
        ping.sys.probe(value, function(isAlive) {
            if (isAlive) {
                console.log(`Success: ${value}`);
            }
        });
    })
});
