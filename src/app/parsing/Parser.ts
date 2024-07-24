import _ from 'lodash';
import {LogDetailEntity, EXPECTED_LOG_ATTRIBUTE_COUNT} from './LogDetailEntity'
import { getDate, getNumber, getRequestDetails } from '../Utils/Utils';
import {InMemoryLogStorage} from '../storage/InMemoryLogStore';

class Parser {
  
    private currLineNumber: number;
  
    constructor() {
      this.currLineNumber = 0;
    }
  
    public readLines(lines: string[]) : LogDetailEntity[] {
      // loop over all the unreadlines
      let lineNumber = this.currLineNumber;
      let logEntities : LogDetailEntity[] = [];
      while(lineNumber < lines.length) {
        // Parse each line
        try {
          let logDetail = this.readLine(lines[lineNumber]);
          logEntities.push(logDetail);
        } catch (error) {
          // ignoring any parse failure
          console.warn("log line parse failure!: "+ error);
        }
        lineNumber++;
      }
      this.currLineNumber = lineNumber;
      return logEntities;
    } 
  
    public readLine(line: string): LogDetailEntity {
      return this.parseLine(line);
    }
  
    private parseLine(line: string): LogDetailEntity {
      let logAttributes : string[] = [];
      let currStr = "";
      let ignoreSpaceSplit = false;
      for(let i=0;i<line.length;i++) {
        let ch = line.charAt(i);
        if(ch === '[' || (!ignoreSpaceSplit && ch === '"')) {
          ignoreSpaceSplit = true;
          continue;
        } else if( ch === ']' || (ignoreSpaceSplit && ch === '"')) {
          ignoreSpaceSplit = false;
          continue;
        } 
        if(ch === ' ') {
          if(ignoreSpaceSplit) {
            currStr = currStr.concat(ch);
          } else {
            logAttributes.push(currStr);
            currStr = '';
          }
        } else {
          currStr = currStr.concat(ch);
        }
      }
      
      // Todo: push only if currStr is non-empty
      logAttributes.push(currStr);
      // console.log(logAttributes);
      if(EXPECTED_LOG_ATTRIBUTE_COUNT !== logAttributes.length) {
        throw new Error("Parsing failed! Missing attributes");
      } 
      
      let date = getDate(logAttributes[3]);      
      let resSz = getNumber(logAttributes[6]);

      let requestDetails = getRequestDetails(logAttributes[4]);
      
      return new LogDetailEntity(logAttributes[0],logAttributes[1],
        logAttributes[2], date, requestDetails, logAttributes[5],
        resSz, logAttributes[7],logAttributes[8]);
    }
  
}

export {Parser};
  