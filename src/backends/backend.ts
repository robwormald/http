import {HttpRequest} from '../request'
import {HttpResponse} from '../response'
import {Observable} from 'rxjs/Rx'

export abstract class  ResponseObservable extends Observable<HttpResponse> {}

export abstract class HttpBackend {
  abstract fetch(request:HttpRequest): ResponseObservable;
}
