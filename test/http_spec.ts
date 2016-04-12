// import {it, describe, expect} from 'angular2/testing'
// import {Injector, provide} from 'angular2/core'

// import {Http} from '../src/http';
// import {HttpBackend} from '../src/backends/backend'
// import {MockBackend} from '../src/backends/mock_backend'
// import {XHRBackend, BrowserXHR} from '../src/backends/xhr_backend'

// describe('http sanity test', () => {

//   let injector:Injector;
//   let http:Http;
//   let httpSpy:jasmine.Spy;

//   beforeEach(() => {
//     injector = Injector.resolveAndCreate([
//       BrowserXHR,
//       Http,
//       provide(HttpBackend, {useClass: MockBackend}) ]);
//     http = injector.get(Http);
//   });

// 	it('should instantiate Http', () => {
// 		expect(http).toBeDefined();
// 	});

//   it('should instantiate an instance of Http', () => {
//     expect(http).toBeAnInstanceOf(Http);
//   });


// });
