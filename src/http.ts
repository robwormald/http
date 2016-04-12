import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {HttpRequest, HttpRequestOptions} from './request'
import {HttpResponse} from './response'
import {HttpBackend, ResponseObservable} from './backends/backend'

@Injectable()
export class Http {

  constructor(private httpBackend:HttpBackend){}

  request(request: HttpRequest): ResponseObservable {
    return this.httpBackend.fetch(request);
  }

  get(url: string, requestOptions: any = {method: 'GET'}): Observable<HttpResponse> {
    return this.request(new HttpRequest(url, requestOptions));
  }
  put(url: string, body: any, options?:HttpRequestOptions): Observable<HttpResponse> {
    throw 'unimplemented'
  }
  post(url: string, body: any, options?:HttpRequestOptions): Observable<HttpResponse> {
    throw 'unimplemented'
  }
  patch(url: string, body: any, options?:HttpRequestOptions): Observable<HttpResponse> {
    throw 'unimplemented'
  }
  delete(url: string, options?:HttpRequestOptions): Observable<HttpResponse> {
    throw 'unimplemented'
  }

  head(url:string, options?:HttpRequestOptions): Observable<HttpResponse> {
    throw 'unimplemented'
  }

}
