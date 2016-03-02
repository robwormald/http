import {it, describe} from 'angular2/testing'

import {Http} from '../src/http';

describe('http sanity test', () => {
	it('should import Http', () => {
		expect(Http).toBeDefined();
	});
	
	it('should create an instance', () => {
		let http = new Http();
		expect(http.get()).toEqual('test')
	});
});
