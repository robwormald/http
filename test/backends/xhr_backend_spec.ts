import {it, describe, expect, beforeEach} from 'angular2/testing';
import {Injector, provide} from 'angular2/core';
import {HttpHeaders} from '../../src/headers';
import {HttpRequest} from '../../src/request';

import {XHRBackend, BrowserXHR} from '../../src/backends/xhr_backend';
import {Observable} from 'rxjs/Observable'

var abortSpy: any;
var sendSpy: any;
var openSpy: any;
var setRequestHeaderSpy: any;
var addEventListenerSpy: any;
var existingXHRs: MockBrowserXHR[] = [];

class MockBrowserXHR extends BrowserXHR {
  static pendingXHRs: MockBrowserXHR[] = [];

  static reset() {
    MockBrowserXHR.pendingXHRs = [];
  }
  abort: any;
  send: any;
  open: any;
  response: any;
  responseText: string;
  setRequestHeader: any;
  callbacks = new Map<string, Function>();
  status: number;
  responseHeaders: string;
  responseURL: string;
  constructor() {
    super();
    this.abort = jasmine.createSpy('abort')
    this.send = sendSpy = jasmine.createSpy('send');
    this.open = openSpy = jasmine.createSpy('open');
    this.setRequestHeader = setRequestHeaderSpy = jasmine.createSpy('setRequestHeader');
  }

  setStatusCode(status: number) { this.status = status; }

  setResponse(value: string) { this.response = value; }

  setResponseText(value: string) { this.responseText = value; }

  setResponseURL(value: string) { this.responseURL = value; }

  setResponseHeaders(value: string) { this.responseHeaders = value; }

  getAllResponseHeaders() { return this.responseHeaders || ''; }

  getResponseHeader(key: string) {
    //return HttpHeaders.fromResponseHeaderString(this.responseHeaders).get(key);
  }

  addEventListener(type: string, cb: Function) { this.callbacks.set(type, cb); }

  removeEventListener(type: string, cb: Function) { this.callbacks.delete(type); }

  dispatchEvent(type: string, event: any) { this.callbacks.get(type)({}); }

  create(): XMLHttpRequest | MockBrowserXHR {
    var xhr = new MockBrowserXHR();
    MockBrowserXHR.pendingXHRs.push(xhr);
    return xhr;
  }
}

describe('xhr_backend sanity test', () => {

  let injector: Injector;
  let xhrBackend: XHRBackend;

  beforeEach(() => {
    injector = Injector.resolveAndCreate([XHRBackend, BrowserXHR]);
    xhrBackend = injector.get(XHRBackend);
  });

  it('should instantiate an instance of XHRBackend', () => {
    expect(xhrBackend).toBeAnInstanceOf(XHRBackend);
  });

});

describe('xhr_backend', () => {

  let injector: Injector;
  let xhrBackend: XHRBackend;


  beforeEach(() => {
    injector = Injector.resolveAndCreate([XHRBackend, provide(BrowserXHR, { useClass: MockBrowserXHR })]);
    xhrBackend = injector.get(XHRBackend);
  });

  afterEach(() => MockBrowserXHR.reset());

  describe('basic functionality', () => {

    let mockRequest: HttpRequest;

    beforeEach(() => {
      mockRequest = new HttpRequest('/hello', {
        method: 'get'
      });
    });

    xit('should create a connection', () => {
      let connection = xhrBackend.fetch(mockRequest);
      expect(connection).toBeAnInstanceOf(Observable);
    });

    xit('should not execute the xhr when created', () => {
      let connection = xhrBackend.fetch(mockRequest);
      let xhr = MockBrowserXHR.pendingXHRs[0];
      expect(xhr.open).not.toHaveBeenCalled();
    });

    xit('should call open on the XHR when subscribed to', () => {
      let connection = xhrBackend.fetch(mockRequest);
      let xhr = MockBrowserXHR.pendingXHRs[0];
      connection.subscribe();
      expect(xhr.open).toHaveBeenCalled();
    });

    xit('should call open on the XHR with the method and url', () => {
      let connection = xhrBackend.fetch(mockRequest);
      let xhr = MockBrowserXHR.pendingXHRs[0];
      connection.subscribe();
      expect(xhr.open).toHaveBeenCalledWith('GET', '/hello');
    });

  })


});

