export class NextError extends Error {
    public digest: string;
    constructor(message: string) {
      super(message);
  
      this.name = "NextError";
      this.digest = Math.random().toString(36).substring(2, 15); // Can be used to identify the error in logs later
    }
    public formatError() {
      return `An error occured: ${this.message} ${this.digest}`;
    }
  }
  
  export class HttpError extends NextError {
    public status: number;
    constructor(message: string, status: number) {
      super(message);
      this.name = "HttpError";
      this.status = status;
    }
  }
  