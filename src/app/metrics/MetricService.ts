import {InMemoryLogStorage} from '../storage/InMemoryLogStore';
import {Metric, UniqueVisitorPerDayMetric, RequestedFileMetric} from './Metric';
import { LogDetailEntity, RequestDetails } from '../parsing/LogDetailEntity';

class MetricService {

    private storage: InMemoryLogStorage;

    constructor(storage: InMemoryLogStorage) {
        this.storage = storage;
    }


    public getMetric(): Metric {
        // Todo: startDate should be midnight of current date.
        // const startDate = new Date();
        // startDate.setHours(0,0,0,0);

        const startDate = new Date(1970, 1, 1);
        const logEntities = this.storage.getLogsInPeriod(startDate);

        // Accumulating metrics
        const uniqueVisitorMetricMap = this.getUniqueVisitorMetric(logEntities);
        const resourceMetricMap = this.getResourceMetrics(logEntities);
        const requestedFileMapWith404Map = this.get404RequestsMetrics(logEntities);

        const totalRequests = this.getTotalRequests(logEntities);
        const totalValidRequests = this.getTotalValidRequests(logEntities);
        const totalFaliedRequests = this.getFailedRequests(logEntities);
        const totalUniqueVisitors = this.getUniqueVisitors(logEntities);
        const totalUniqueFiles = this.getUniqueFiles(logEntities);
        const totalBandwidth = this.bandwidth(logEntities);
        const totalReferrersCount = this.bandwidth(logEntities);
        const totalUnique404Count = this.getUnique404Count(logEntities);

        return new Metric(uniqueVisitorMetricMap,
            resourceMetricMap,
            requestedFileMapWith404Map,

            totalRequests,
            totalValidRequests,
            totalFaliedRequests,
            totalUniqueVisitors,
            totalUniqueFiles,
            totalBandwidth,
            totalReferrersCount,
            totalUnique404Count
        );
    }

    public getUniqueVisitorMetric(logEntities: LogDetailEntity[]): Map<string, UniqueVisitorPerDayMetric>{
        let map = new Map<string, UniqueVisitorPerDayMetric>();
        let uniqueCount = 0;
        for(let logEntity of logEntities) {
            let uniqueVisitorMetric : UniqueVisitorPerDayMetric | undefined;
            if(!map.has(logEntity.authUser)) {
                uniqueVisitorMetric = new UniqueVisitorPerDayMetric(++uniqueCount);
                map.set(logEntity.authUser, uniqueVisitorMetric);
            } 
            uniqueVisitorMetric = map.get(logEntity.authUser);
            uniqueVisitorMetric?.incrementCumulativeResposeSizeBytes(logEntity.responseSize)
                .incrementRequestCount()
                .updateDateIfSmaller(logEntity.timestamp);
        }
        return map;
    }

    public getResourceMetrics(logEntities: LogDetailEntity[]): Map<string, RequestedFileMetric> {
        let map = new Map<string, RequestedFileMetric>();
        for(let logEntity of logEntities) {
            let requestDetails = logEntity.requestDetails;
            let requestedFileMetric : RequestedFileMetric | undefined;
            if(!map.has(requestDetails.toString())) {
                requestedFileMetric = new RequestedFileMetric(requestDetails);
                map.set(requestDetails.toString(), requestedFileMetric);
            }
            requestedFileMetric = map.get(requestDetails.toString());
            requestedFileMetric?.incrementCumulativeResposeSizeBytes(logEntity.responseSize)
                                .incrementRequestCount();
        }
        return map;
    }

    public get404RequestsMetrics(logEntities: LogDetailEntity[]): Map<string, RequestedFileMetric> {
        let map = new Map<RequestDetails, RequestedFileMetric>();
        logEntities = logEntities
                        .filter(logEntity => logEntity.httpStatusCode === "404");

        return this.getResourceMetrics(logEntities);
    }

    public getTotalRequests(logEntities: LogDetailEntity[]): number {
        return logEntities.length;
    }    

    public getTotalValidRequests(logEntities: LogDetailEntity[]): number {
        return logEntities.filter(logEntity => logEntity.httpStatusCode == "200").length;
    } 

    public getFailedRequests(logEntities: LogDetailEntity[]): number {
        return logEntities.filter(logEntity => logEntity.httpStatusCode != "200").length;
    }

    public getUniqueVisitors(logEntities: LogDetailEntity[]): number {
        const uniqueAuthUsers = logEntities.map(logEntity => logEntity.authUser);
        return new Set<string>(uniqueAuthUsers).size;
    }

    public getUniqueFiles(logEntities: LogDetailEntity[]): number {
        const uniqueResourcePaths = logEntities.map(logEntity => logEntity.requestDetails.resource);
        return new Set<string>(uniqueResourcePaths).size;
    }

    public bandwidth(logEntities: LogDetailEntity[]): number {
        return logEntities.map(logEntity => logEntity.responseSize).reduce((a, b) => a+b, 0);
    }

    public uniqueReferrersCount(logEntities: LogDetailEntity[]): number {
        let uniqueReffers = logEntities.map(logEntity => logEntity.referer);
        return new Set<string>(uniqueReffers).size;
    }

    public getUnique404Count(logEntities: LogDetailEntity[]) : number {
        let unique404 = logEntities
            .filter(logEntity => logEntity.httpStatusCode == "404")
            .map(logEntity => logEntity.requestDetails)
            .map(requestDetails => requestDetails.toString());
        return new Set<string>(unique404).size;
    }
}

export {MetricService};