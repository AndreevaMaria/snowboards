import { writeFileSync } from "fs";
import snowboards from './snowboards';


function send(result) {
    writeFileSync('result.json', JSON.stringify(result, 2, 2))
}

snowboards(false, send);