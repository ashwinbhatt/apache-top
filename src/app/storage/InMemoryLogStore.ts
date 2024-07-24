import {LogDetailEntity} from '../parsing/LogDetailEntity';

class InMemoryLogStorage {

    savedLogs: LogDetailEntity[];
    
    constructor() {
        this.savedLogs = []; 
    }

    public addLog(logEntities: LogDetailEntity[]) : boolean {
        for(let logEntity of logEntities) {
            this.savedLogs.push(logEntity);
        }
        return true;
    }

    public getLogsInPeriod(startDate: Date, endDate?: Date) : LogDetailEntity[] {
        const startTimeMillisec = startDate.getTime();
        const endTimeMillisec = (endDate == null) ? Number.MAX_VALUE: endDate.getTime();

        const selectedLogs = this.savedLogs
            .filter(log => {
                const currTimeMillisec = log.timestamp.getTime();
                if(startTimeMillisec <= currTimeMillisec && currTimeMillisec <= endTimeMillisec) {
                    return true;
                }
                return false;
            })
        return selectedLogs;
    }

}

export {InMemoryLogStorage};