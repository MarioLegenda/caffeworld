const config = require('dotenv').config();
if (process.env.ENV !== 'test') {
    console.warn('It is forbidden to run tests in any other environment other than test. Running environment is ' + process.env.ENV);
    process.exit(1);
}
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const mocha = new Mocha({
    ui: 'bdd',
    reporter: 'list'
});
const testDir = path.resolve(__dirname);
const directories = [];
directories.push(path.resolve(__dirname));
directories.push(path.resolve(__dirname, 'unit'));
for (let dir of directories) {
    fs.readdirSync(dir).filter(function (file) {
        return file.substr(-3) === '.js';
    }).forEach(function (file) {
        mocha.addFile(path.join(dir, file));
    });
}
mocha.run(function (failures) {
    process.on('exit', function () {
        process.exit(failures);
    });
});
