import _ from 'lodash';
import { parse } from 'date-format-parse';
import { RequestDetails } from '../parsing/LogDetailEntity';

const LOG_TIMESTAMP_FORMAT = 'DD/MMM/YYYY:HH:MM:ss ZZ';

function getDate(dateStr: string): Date {
    let date = parse(dateStr, LOG_TIMESTAMP_FORMAT)
    if(Number.isNaN(date.getDate)) {
        throw new Error("Date parsing failed!");
    }
    return date;
} 

function getNumber(numStr: string): number {
    if(_.isNumber(numStr)) {
        throw new Error("Reponse size parsing failed!");
      }
    return Number.parseInt(numStr);
}

function getRequestDetails(requestStr: string): RequestDetails {
    let requestSplit = requestStr.split(' ');
    if(requestSplit.length != 3) {
      throw new Error("Cannot parse request invalid details!");
    }
    let requestDetails = new RequestDetails(requestSplit[0], requestSplit[1], requestSplit[2]);
    return requestDetails;
}

export {getDate, getNumber, getRequestDetails};