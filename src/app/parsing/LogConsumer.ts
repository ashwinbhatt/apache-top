import {InMemoryLogStorage} from '../storage/InMemoryLogStore';
import { Parser } from './Parser';
import fs from 'node:fs/promises';
import printf from "printf";
import { setTimeout } from 'node:timers/promises';

class LogConsumer {

    private storage: InMemoryLogStorage;
    private parser = new Parser();

    constructor(storage: InMemoryLogStorage) {
        this.storage = storage;
        this.parser = new Parser();
    }

    public async readMetricFromLog(filePath: string) {

        while(true) {

            try {
                // console.log("Reading log file...")
                const data = await fs.readFile(filePath, { encoding: 'utf8' });
                let lines = data.split('\n');

                let logEntities = this.parser.readLines(lines);
                if(logEntities.length > 0) {
                  // console.log(logEntities[0]);
                  console.log(printf('Found %(newCount)s logs', {newCount: logEntities.length}));
                  this.storage.addLog(logEntities);
                }
            } catch (error) {
                console.error(error);
            }
            // Note: making todo large, smaller value leads to caching and updated logs are not read.
            await setTimeout(10000);
        }
        console.log("Log Consumer is exiting !!")
    }

}

export {LogConsumer};