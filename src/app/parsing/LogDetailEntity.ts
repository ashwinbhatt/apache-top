const EXPECTED_LOG_ATTRIBUTE_COUNT = 9;

class LogDetailEntity {
    // Todo: add getters and make fields private
    ipAdd: string;
    remoteUser: string;
    authUser: string;
    timestamp: Date;
    requestDetails: RequestDetails;
    httpStatusCode: string;
    responseSize: number;
    referer: string;
    userAgent: string;
  
    constructor(ipAdd: string, remoteUser: string, authUser: string, timestamp: Date, requestDetails: RequestDetails, httpStatusCode: string,
       responseSize: number, referer: string, userAgent: string) {
          this.ipAdd = ipAdd;
          this.remoteUser = remoteUser;
          this.authUser = authUser;
          this.timestamp = timestamp;
          this.requestDetails = requestDetails;
          this.httpStatusCode = httpStatusCode;
          this.responseSize = responseSize;
          this.referer = referer;
          this.userAgent = userAgent;
      }
}

class RequestDetails {
    verb: string;
    resource: string;
    httpVersion: string;
    
    constructor(verb: string, resource: string, httpVersion: string) {
        this.verb = verb;
        this.resource = resource;
        this.httpVersion = httpVersion;
    }

    public toString() : string {
        return (this.verb + '|' + this.resource + '|' + this.httpVersion).toLocaleLowerCase();
    }
}

export {LogDetailEntity, RequestDetails, EXPECTED_LOG_ATTRIBUTE_COUNT};
