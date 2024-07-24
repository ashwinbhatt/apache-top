import {InMemoryLogStorage} from '../../app/storage/InMemoryLogStore'
import { LogDetailEntity, RequestDetails } from '../../app/parsing/LogDetailEntity';



function positiveCaseTest(storage: InMemoryLogStorage): void {
    const expectedCount = 3;
    let startDate = new Date(2010, 1, 1);
    let endDate = new Date(2020, 1, 1);

    let logs = storage.getLogsInPeriod(startDate, endDate);
    if(logs.length != expectedCount) {
        console.error("Test failure! Expected log count " + expectedCount + " , Got: "+logs.length);
        return;
    }
    console.log("Positive storage test is successfull!");
}



function InMemoryLogStorageTests() {
    const storage = new InMemoryLogStorage();

    // dummy dates
    let d1 = new Date(1990, 1, 1);
    let d2 = new Date(1995, 7, 8);
    let d3 = new Date(2000, 1, 1);
    let d4 = new Date(2005, 6, 30);
    let d5 = new Date(2010, 1, 1);
    let d6 = new Date(2015, 1, 1);
    let d7 = new Date(2019, 12, 31);
    let d8 = new Date(2020, 1, 2);
    
    
    storage.addLog(new LogDetailEntity("1", "", "", d1, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("2", "", "", d2, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("3", "", "", d3, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("4", "", "", d4, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("5", "", "", d5, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("6", "", "", d6, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("7", "", "", d7, new RequestDetails("", "", ""), "", 1, "", ""));
    storage.addLog(new LogDetailEntity("8", "", "", d8, new RequestDetails("", "", ""), "", 1, "", ""));
    
    positiveCaseTest(storage);
}
export {InMemoryLogStorageTests};