const fs = require("fs");

//import { writeFileSync } from "fs";

let snowboards = require('./snowboards')

function send(result) {
    fs.writeFileSync('./result.json', JSON.stringify(result, 2, 2))
}

snowboards(false, send);