import {RequestDetails} from '../parsing/LogDetailEntity';

class Metric {

    uniqueVisitorPerDayMetricMap : Map<string, UniqueVisitorPerDayMetric>;
    requestedFileMap : Map<string, RequestedFileMetric>;
    requestedFileMapWith404Map : Map<string, RequestedFileMetric> ; 

    totalRequestCount : number;
    validRequestCount : number;
    failedRequestCount: number;
    uniqueVisitorsCount:number;
    uniqueFileCount   : number;
    bandwidthUsage    : number;
    uniqueReferrersCount : number;
    unique404Count    : number;


    constructor(uniqueVisitorPerDayMetricMap : Map<string, UniqueVisitorPerDayMetric>, 
        requestedFileMap : Map<string, RequestedFileMetric>,
        requestedFileMapWith404Map : Map<string, RequestedFileMetric>,
        totalRequestCount : number,
        validRequestCount : number,
        failedRequestCount: number,
        uniqueVisitorsCount:number,
        uniqueFileCount   : number,
        bandwidthUsage    : number,
        uniqueReferrersCount : number,
        unique404Count    : number
    ) {
        this.uniqueVisitorPerDayMetricMap = uniqueVisitorPerDayMetricMap;
        this.requestedFileMap = requestedFileMap;
        this.requestedFileMapWith404Map = requestedFileMapWith404Map;

        this.totalRequestCount = totalRequestCount;
        this.validRequestCount = validRequestCount;
        this.failedRequestCount = failedRequestCount;
        this.uniqueVisitorsCount = uniqueVisitorsCount;
        this.uniqueFileCount = uniqueFileCount;
        this.bandwidthUsage = bandwidthUsage;
        this.uniqueReferrersCount = uniqueReferrersCount;
        this.unique404Count = unique404Count;
    }

}

class UniqueVisitorPerDayMetric {
    private enumeration: number;
    private cumulativeResposeSizeBytes: number;
    private firstRequestTimeStamp: Date | null;
    private requestCount: number;

    constructor(enumeration: number) {
        this.enumeration = enumeration;
        this.cumulativeResposeSizeBytes = 0;
        this.firstRequestTimeStamp = null;
        this.requestCount = 0;
    }
    
    public incrementCumulativeResposeSizeBytes(increment: number) : UniqueVisitorPerDayMetric {
        this.cumulativeResposeSizeBytes += increment;
        return this;
    }

    public updateDateIfSmaller(date: Date) : UniqueVisitorPerDayMetric {
        if(this.firstRequestTimeStamp == null) {
            this.firstRequestTimeStamp = new Date(date);
        } else if(date.getTime() < this.firstRequestTimeStamp.getTime()) {
            this.firstRequestTimeStamp = date;
        }
        return this;
    }

    public incrementRequestCount() : UniqueVisitorPerDayMetric {
        this.requestCount++;
        return this;
    }
}

class RequestedFileMetric {
    private requestDetails: RequestDetails;
    private requestCount: number;
    private cumulativeResposeSizeBytes: number;

    public constructor(requestDetails: RequestDetails) {
        this.requestDetails = requestDetails;
        this.requestCount = 0;
        this.cumulativeResposeSizeBytes = 0;
    }

    public incrementRequestCount() : RequestedFileMetric {
        this.requestCount++;
        return this;
    }
    
    public incrementCumulativeResposeSizeBytes(increment: number) : RequestedFileMetric {
        this.cumulativeResposeSizeBytes += increment;
        return this;
    } 
}

export {Metric, UniqueVisitorPerDayMetric, RequestedFileMetric};