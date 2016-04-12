import {HttpHeaders} from './headers'
import {HttpBody} from './body'

export type HttpCredentials = 'same-origin' | 'include' | 'omit'

export interface HttpRequestOptions {
  url?:string;
  body?:any;
  credentials?:HttpCredentials | boolean;
  headers?:any;
  method?: string;
}

export class HttpRequest extends HttpBody {

  private _method:string;

  set method(method:string){
    this._method = method.toUpperCase();
  }
  get method(){
    return this._method;
  }

  get body(){
    return this._body;
  }

  url:string;
  credentials: HttpCredentials | boolean;
  headers: HttpHeaders;

  constructor(input:string | HttpRequest, options:HttpRequestOptions = {}){
    super();
    let body = options.body;

    if(HttpRequest.isPrototypeOf(input)){
      this.url = (<HttpRequest> input).url;
      this.credentials = (<HttpRequest> input).credentials;
      if(!options.headers){
        this.headers = new HttpHeaders((<HttpRequest> input).headers);
      }
      this.method = (<HttpRequest> input).method;
      if(!body){
        body = (<HttpRequest> input).body;
      }
    }
    else {
      this.url = (<string> input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if(options.headers || !this.headers){
      this.headers = new HttpHeaders(options.headers);
    }
    this.method = options.method || this.method || 'GET'

    if((this.method === 'GET' || this.method === 'HEAD') && body){
      throw new TypeError('Body not allowed for Http Requests with method GET or HEAD!');
    }

    this._init(options.body);

  }
}
