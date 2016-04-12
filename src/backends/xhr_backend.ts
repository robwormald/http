import {Injectable} from 'angular2/core'
import {HttpBackend, ResponseObservable} from './backend';
import {HttpRequest, HttpRequestOptions} from '../request';
import {HttpResponse, HttpResponseOptions} from '../response';
import {HttpHeaders} from '../headers'
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscriber} from 'rxjs/Subscriber';
import {dataTypeSupport} from '../utils'

const XHR_ONPROGRESS = 'progress';
const XHR_ONLOAD = 'load';
const XHR_ONERROR = 'error';
const XHR_ONREADYSTATECHANGE = 'readystatechange';

export class BrowserXHR {
  create(): XMLHttpRequest | any {
    return new XMLHttpRequest();
  }
}

export class XHRResponseObservable extends ResponseObservable {
  request:HttpRequest;
  private _xhr: XMLHttpRequest;
  constructor(request:HttpRequest, xhrFactory:BrowserXHR){
    super();
    this.request = request;
    this._xhr = xhrFactory.create();
  }
  _subscribe(subscriber:Subscriber<HttpResponse>){
    let {request, _xhr} = this;
    return new XHRResponseSubscriber(subscriber, request, _xhr);
  }
}

export class XHRResponseSubscriber<T> extends Subscriber<Event> {
  private _request: HttpRequest;
  private _xhr:XMLHttpRequest;
  constructor(destination:Subscriber<HttpResponse>, request:HttpRequest, xhr:XMLHttpRequest){
    super(destination);
    this._request = request;
    this._xhr = xhr;
    this._send();
  }

  private _send(){
    let xhr = this._xhr;
    let request = this._request;
    xhr.open(request.method, request.url);

      const onLoad = (e:Event) => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          this.next(e);
          this.complete();
          return;
        };
        //TODO: progress
      }
      const onError = (err:ErrorEvent) => {
        console.log('errrr', xhr)
        this.error(new TypeError('Network Request Failed'));
        return;
      };

      xhr.addEventListener(XHR_ONLOAD, onLoad);
      xhr.addEventListener(XHR_ONERROR, onError);

      request.headers.forEach((value, key) => {
        xhr.setRequestHeader(key, value);
      });

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if('responseType' in xhr && dataTypeSupport.blob){
        xhr.responseType = 'blob'
      }

      xhr.send(request.body);

      return () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.removeEventListener(XHR_ONLOAD, onLoad);
          xhr.removeEventListener(XHR_ONERROR, onError);
          xhr.abort();
        }
      }
  }

  next(e:Event){
    this.destination.next(this._responseFromXHR(this._xhr));
  }

  private _responseFromXHR(xhr: XMLHttpRequest): HttpResponse {

    let {status, statusText} = xhr;

    let url = this._getResponseURL(xhr);

    let body = xhr.response || xhr.responseText;

    let headers = HttpHeaders.fromResponseHeaderString(xhr.getAllResponseHeaders());

    // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
    status = status === 1223 ? 204 : status;

    // fix status code when it is 0 (0 status is undocumented).
    // Occurs when accessing file resources or on Android 4.1 stock browser
    // while retrieving files from application cache.
    if(status === 0){
      status = body ? 200 : 0;
    }

    return new HttpResponse(body, {status, statusText, url, headers})
  }

  private _getResponseURL(xhr:XMLHttpRequest):string {

    if('responseURL' in xhr){
      return (<any> xhr).responseURL;
    }

    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
      return xhr.getResponseHeader('X-Request-URL')
    }
  }

}



@Injectable()
export class XHRBackend extends HttpBackend {
  constructor(private _xhrFactory:BrowserXHR){
    super();
  }
  fetch(input:string | HttpRequest, init?: HttpRequestOptions): ResponseObservable {
    let request:HttpRequest;
    if(HttpRequest.isPrototypeOf(input) && !init){
      request = (<HttpRequest> input);
    }
    else {
      request = new HttpRequest(input, init);
    }

    return new XHRResponseObservable(request, this._xhrFactory);

  }


}
