//based on the github/fetch polyfill test suite here https://github.com/github/fetch/blob/master/test/test.js

import {it, describe, expect} from 'angular2/testing'
import {Injector, provide} from 'angular2/core'

import {Http} from '../src/http';
import {HttpRequest} from '../src/request'
import {HttpResponse} from '../src/response'
import {HttpBackend, ResponseObservable} from '../src/backends/backend'
import {XHRBackend, BrowserXHR} from '../src/backends/xhr_backend'
import {dataTypeSupport} from '../src/utils'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'

console.log(dataTypeSupport)

let environments = ['fetch', 'xhr'];
let native:any = {};

interface completer {
  (err?:any):void;
}

environments.forEach((environment) => {

  describe(`http integration test - ${environment}`, () => {

    const configEnv = () => {
      if(environment === 'xhr' && 'fetch' in self){
        dataTypeSupport.nativeFetch = false;
      }
      else if(environment === 'nativefetch' && 'fetch' in self){
        dataTypeSupport.nativeFetch = true;
      }
    }

    let injector: Injector;
    let http: Http;
    let httpBackend: XHRBackend;
    let httpSpy: jasmine.Spy;

    beforeEach(() => {
      injector = Injector.resolveAndCreate([
        BrowserXHR,
        Http,
        provide(HttpBackend, { useClass: XHRBackend })]);
      httpBackend = injector.get(HttpBackend);
      http = injector.get(Http);
      configEnv();
    });

    it('should instantiate the backend', () => {
      expect(httpBackend).toBeAnInstanceOf(XHRBackend);
    });

    it('should instantiate an instance of Http', () => {
      expect(http).toBeAnInstanceOf(Http);
    });

    it('should send request headers', (done:completer) => {
      httpBackend.fetch('/request', {headers: {
        'Accept': 'application/json',
        'X-test': 42
      }})
      .flatMap(res => res.json())
      .subscribe(data => {
        let headers = data.headers;
        expect(data.headers['accept']).toEqual('application/json');
        expect(data.headers['x-test']).toEqual('42');
        done();
      });
    });

    it('should next() on 500', (done:completer) => {
      httpBackend.fetch('/boom')
      .subscribe(res => {
        expect(res.status).toEqual(500);
        expect(res.ok).toBe(false);
        done();
      });
    });

    it('should error() on network errors', (done:completer) => {
      //use direct URL since karma proxy swallows the disconnect
      httpBackend.fetch('http://localhost:3001/error')
      .subscribe(res => {
        throw new Error('backend should not call next() on network errors!');
      }, (err) => {
        expect(err).toBeAnInstanceOf(TypeError);
        done();
      });
    });

    it('should send ArrayBuffer body', (done:completer) => {
      var text = 'name=Angular2'
      var buf = new ArrayBuffer(text.length);
      var view = new Uint8Array(buf);

      for(var i = 0; i < text.length; i++) {
        view[i] = text.charCodeAt(i)
      }

      httpBackend.fetch('/request', {
        method: 'post',
        body: buf
      })
      .flatMap(response => response.json())
      .subscribe(function(request) {
        expect(request.method).toEqual('POST')
        expect(request.data).toEqual('name=Angular2');
        done();
      });
    });

    it('should send URLSearchParams body', (done:completer) => {
      let SearchParamsCtor:any = (<any>self)['URLSearchParams'];
      httpBackend.fetch('/request', {
        method: 'post',
        body: new SearchParamsCtor('a=1&b=2')
      })
      .flatMap(response => response.json())
      .subscribe(request => {
        expect(request.method).toBe('POST');
        expect(request.data).toBe('a=1&b=2');
        done();
      });
    });

    it('should parse ArrayBuffer body', (done:completer) => {
      httpBackend.fetch('/hello')
      .flatMap(response => response.arrayBuffer())
      .subscribe(buffer => {
        expect(buffer).toBeAnInstanceOf(ArrayBuffer);
        expect(buffer.byteLength).toEqual(2);
        done();
      });
    });

    it('should handle binary data', (done:completer) => {
      httpBackend.fetch('/binary')
      .flatMap(response => response.arrayBuffer())
      .subscribe(buffer => {
        console.log(buffer)
        expect(buffer).toBeAnInstanceOf(ArrayBuffer);
        expect(buffer.byteLength).toEqual(256);
        let view = new Uint8Array(buffer)
        for (let i = 0; i < 256; i++) {
           expect(view[i]).toEqual(i);
        }
        done();
      }, err => {
        console.log(err);
        throw err
      });
    });
  });
});


