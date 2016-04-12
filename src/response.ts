import {HttpHeaders} from './headers'
import {HttpBody} from './body'
export interface HttpResponseOptions {
  status?:number;
  statusText?:string;
  headers?: HttpHeaders | any;
  url?:string;
}

export class HttpResponse extends HttpBody {
  type:string;
  status:number;
  ok:boolean;
  statusText:string;
  headers:HttpHeaders;
  url:string;
  constructor(body:any, options:HttpResponseOptions){
    super();
    this.type = 'default';
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers;
    this.url = options.url || '';
    this._init(body);

  }

  static error(){
    let errorResponse = new HttpResponse(null, {status: 0, statusText: ''});
    errorResponse.type = 'error';
    return errorResponse;
  }
}

