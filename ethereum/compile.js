const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const builtPath = path.resolve(__dirname, 'build');
fs.removeSync(builtPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs.ensureDir(builtPath);

console.log(output);
for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(builtPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}