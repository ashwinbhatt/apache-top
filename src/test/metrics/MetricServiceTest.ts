import {MetricService} from '../../app/metrics/MetricService';
import { LogDetailEntity, RequestDetails } from '../../app/parsing/LogDetailEntity';
import {InMemoryLogStorage} from '../../app/storage/InMemoryLogStore';




function getUniqueVisitorMetricTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("", "", ""), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("", "", ""), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("", "", ""), "200", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("", "", ""), "200", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("", "", ""), "200", 1, "", "");
    
    storage.addLog(l1);
    storage.addLog(l2);
    storage.addLog(l3);
    storage.addLog(l4);
    storage.addLog(l5);

    const uniqueVisitorMetricMap = metricService.getMetric().uniqueVisitorPerDayMetricMap;

    if(uniqueVisitorMetricMap.size != 3) {
        console.error("getUniqueVisitorMetricTest failed! Expected log count " + 3 + " , Got: " +uniqueVisitorMetricMap.size);
        return;
    }
    const uniqueVisitorSet = new Set<string>();
    for(let userName of uniqueVisitorMetricMap.keys()) {
        uniqueVisitorSet.add(userName);
    }
    if( !uniqueVisitorSet.has("1")   || !uniqueVisitorSet.has("2")   || !uniqueVisitorSet.has("3")  ) {
        console.error("getUniqueVisitorMetricTest failed! Expected user not found!");
        return;
    }
    console.log("getUniqueVisitorMetricTest Success!");
}

function getResourceMetricsTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "200", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "200", 1, "", "");

    const resourceMetric = metricService.getResourceMetrics([l1, l2, l3, l4, l5]);
    if(resourceMetric.size != 3) {
        console.error("getResourceMetricsTest failed! Expected log count " + 3 + " , Got: " +resourceMetric.size);
        return;
    }
    console.log("getResourceMetricsTest Success!");
}

function get404RequestsMetricsTest() {

    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "404", 1, "", "");

    const requestedFileMapWith404Map = metricService.get404RequestsMetrics([l1, l2, l3, l4, l5]);
    if(requestedFileMapWith404Map.size != 3) {
        console.error("get404RequestsMetricsTest failed! Expected log count " + 3 + ", Got: "+requestedFileMapWith404Map.size);
        return;
    }    
    console.log("get404RequestsMetricsTest Success!");
}

function getTotalRequestsTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "404", 1, "", "");

    const totalRequests = metricService.getTotalRequests([l1, l2, l3, l4, l5]);

    if(totalRequests != 5) {
        console.error("getTotalRequestsTest Failed! Expected value: "+ 5 + ", + Got: "+totalRequests)
        return;
    }
    console.log("getTotalRequestsTest Success!");
}

function getTotalValidRequestsTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "404", 1, "", "");

    const totalValidRequests = metricService.getTotalValidRequests([l1, l2, l3, l4, l5]);

    if(totalValidRequests != 2) {
        console.error("getTotalValidRequestsTest Failed! Expected value: "+ 5 + ", + Got: "+totalValidRequests)
        return;
    }
    console.log("getTotalValidRequestsTest Successful!");
}

function getFailedRequestsTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "404", 1, "", "");
    
    const totalFaliedRequests = metricService.getFailedRequests([l1, l2, l3, l4, l5]);
    if(totalFaliedRequests != 3) {
        console.error("getFailedRequestsTest Failed! Expected value: "+ 3 + ", + Got: "+totalFaliedRequests)
        return;
    }
    console.log("getFailedRequestsTest Successful!");
}

function getUniqueVisitorsTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "a", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "c", "c"), "404", 1, "", "");

    const totalUniqueVisitors = metricService.getUniqueVisitors([l1, l2, l3, l4, l5]);
    if(totalUniqueVisitors != 3) {
        console.error("getUniqueVisitorsTest Failed! Expected value: "+ 3 + ", + Got: "+totalUniqueVisitors)
        return;
    }
    console.log("getUniqueVisitorsTest Successful!");
}

function getUniqueFilesTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/b", "a"), "200", 1, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/c", "a"), "404", 1, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "/b", "b"), "404", 1, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "/c", "c"), "404", 1, "", "");

    const totalUniqueFiles = metricService.getUniqueFiles([l1, l2, l3, l4, l5]);
    if(totalUniqueFiles != 3) {
        console.error("getUniqueFilesTest Failed! Expected value: "+ 3 + ", + Got: "+totalUniqueFiles)
        return;
    }
    console.log("getUniqueFilesTest Successful!");
} 

function bandwidthTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/a", "a"), "200", 1, "", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/b", "a"), "200", 2, "", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/c", "a"), "404", 3, "", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "/b", "b"), "404", 4, "", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "/c", "c"), "404", 5, "", "");

    const bandwidthSum = metricService.bandwidth([l1, l2, l3, l4, l5]);
    if(bandwidthSum != 15) {
        console.error("bandwidthTest Failed! Expected value: "+ 15 + ", + Got: "+bandwidthSum)
        return;
    }
    console.log("bandwidthTest Successful!");

}

function uniqueReferrersCountTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/a", "a"), "200", 1, "/a", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/b", "a"), "200", 2, "/b", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/c", "a"), "404", 3, "/a", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "/b", "b"), "404", 4, "/c", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("c", "/c", "c"), "404", 5, "/d", "");

    const uniqueReffers = metricService.uniqueReferrersCount([l1, l2, l3, l4, l5]);
    if(uniqueReffers != 4) {
        console.error("uniqueReferrersCountTest Failed! Expected value: "+ 4 + ", + Got: "+uniqueReffers)
        return;
    }
    console.log("uniqueReferrersCountTest Successful!");
}

function getUnique404CountTest() {
    const storage = new InMemoryLogStorage();
    const metricService = new MetricService(storage);

    // sample logs
    const l1 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/a", "a"), "200", 1, "/a", "");
    const l2 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/b", "a"), "200", 2, "/b", "");
    const l3 = new LogDetailEntity("", "", "1", new Date(), 
        new RequestDetails("a", "/c", "a"), "404", 3, "/a", "");
    const l4 = new LogDetailEntity("", "", "2", new Date(), 
        new RequestDetails("b", "/b", "b"), "404", 4, "/c", "");
    const l5 = new LogDetailEntity("", "", "3", new Date(), 
        new RequestDetails("b", "/b", "b"), "404", 5, "/d", "");

    const unique404Count = metricService.getUnique404Count([l1, l2, l3, l4, l5]);
    if(unique404Count != 2) {
        console.error("getUnique404CountTest Failed! Expected value: "+ 2 + ", + Got: "+unique404Count)
        return;
    }
    console.log("getUnique404CountTest Successful!");
}


function MetricServiceTests() {
    getUniqueVisitorMetricTest();
    getResourceMetricsTest();
    get404RequestsMetricsTest();
    getTotalRequestsTest();
    getTotalValidRequestsTest();
    getFailedRequestsTest();
    getUniqueVisitorsTest();
    getUniqueFilesTest();
    bandwidthTest();
    uniqueReferrersCountTest();
    getUnique404CountTest();
}

export {MetricServiceTests};
