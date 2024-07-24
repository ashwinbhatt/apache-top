import { setTimeout } from 'node:timers/promises';
import fs from 'node:fs/promises';
import printf from "printf";
import {Parser} from './parsing/Parser';
import { InMemoryLogStorage } from './storage/InMemoryLogStore';
import {LogConsumer} from './parsing/LogConsumer';
import { GetMetricCommand } from './commandline/GetMetricCommand';
import { MetricService } from './metrics/MetricService';
import { Metric } from './metrics/Metric';


const LOG_PATH = 'log-generator/access.log';

const storage = new InMemoryLogStorage();
const logConsumer = new LogConsumer(storage);
const metricService = new MetricService(storage);
const getMetricCommand = new GetMetricCommand(metricService);

// starting async log reading 
logConsumer.readMetricFromLog(LOG_PATH);

async function main() {
  while(true) {
    // console.clear();
    const metric = getMetricCommand.getMetric();
    // metric object here contains all the metric that is requested by user.
    // Todo: Display complete metric. Disabled now as console gets cluttered.
    console.log("Request count " + metric.totalRequestCount);
    await setTimeout(2000);
  }
}

main();
