const {exec} = require('child_process');
const mongodb = require('mongodb');
const { ClientEncryption } = require('mongodb-client-encryption');
const { MongoClient } = require('mongodb');

const seedDatabase = () => {
    console.log('running seed database');
    exec("mongoimport --type csv -d relatedProducts -c products --headerline --drop related.csv", (error, stdout, stderr)=> {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

}
exports.seedDatabase = seedDatabase;