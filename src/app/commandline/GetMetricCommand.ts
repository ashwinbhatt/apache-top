import { start } from "repl";
import { Metric } from "../metrics/Metric";
import { MetricService } from "../metrics/MetricService"; 
import { getDate } from "../Utils/Utils";


class GetMetricCommand {
    private metricService;

    constructor(metricService: MetricService) {
        this.metricService = metricService;
    }

    public getMetric(): Metric {
        // Todo: get current Date, and calculate startDate/endDate from it.
        return this.metricService.getMetric();
    }
}

export {GetMetricCommand};