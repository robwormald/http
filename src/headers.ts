import {dataTypeSupport} from './utils'

// When Symbol.iterator doesn't exist, retrieves the key used in es6-shim
declare var Symbol: any;
declare var Map: any;
var _symbolIterator: any = null;
export function getSymbolIterator(): string | symbol {
  if (!_symbolIterator) {
    if ('Symbol' in self && Symbol.iterator) {
      _symbolIterator = Symbol.iterator;
    } else {
      // es6-shim specific logic
      var keys = Object.getOwnPropertyNames(Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'entries' && key !== 'size' &&
          Map.prototype[key] === Map.prototype['entries']) {
          _symbolIterator = key;
        }
      }
    }
  }
  return _symbolIterator;
}

const normalizeHeaderName = (name: any) => {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
    throw new TypeError('Invalid Character in Header Name!');
  }
  return (<string>name).toLowerCase();
}

const normalizeHeaderValue = (value: any) => {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}

export class HttpHeaders {
  private _headersMap: { [key: string]: string[] } = {};

  constructor(headers?: HttpHeaders | { [key: string]: any }) {
    if (headers instanceof HttpHeaders) {
      headers.forEach((value, name) => {
        this.append(name, (<any> value));
      });
    }
    else if(headers){
      Object.getOwnPropertyNames(headers).forEach((name) => {
        this.append(name, headers[name])
      });
    }
  }

  static fromResponseHeaderString(headersString: string): HttpHeaders {
    return headersString.trim()
      .split('\n')
      .map(val => val.split(':'))
      .map(([key, ...parts]) => ([key.trim(), parts.join(':').trim()]))
      .reduce((headers, [key, value]) => !headers.set(key, value) && headers, new HttpHeaders());
  }

  append(name: string, value: string): void {
    name = normalizeHeaderName(name);
    value = normalizeHeaderValue(value);
    let values = this._headersMap[name];
    if (!values) {
      values = [];
      this._headersMap[name] = values;
    }
    values.push(value);
  }
  delete(name: string): void {
    delete this._headersMap[normalizeHeaderName(name)];
  }

  get(name: string): string {
    var values = this._headersMap[normalizeHeaderName(name)];
    return values ? values[0] : null
  }

  getAll(): string[] {
    return this._headersMap[normalizeHeaderName(name)] || [];
  }

  has(name: string): boolean {
    return this._headersMap.hasOwnProperty(normalizeHeaderName(name))
  }

  set(name: string, value: string | string[]): void {
    this._headersMap[normalizeHeaderName(name)] = [normalizeHeaderValue(value)];
  }

  forEach(cb: (value: string, name: string, thisArg?:any) => void, thisArg?: any): void {
    Object.getOwnPropertyNames(this._headersMap).forEach((name) => {
      this._headersMap[name].forEach((value) => {
        cb.call(thisArg, value, name, this);
      });
    });
  }
  values() {
    let items: string[] = [];
    this.forEach((value) => items.push(value));

    var iterator: any = {
      next: function() {
        var value = items.shift()
        return { done: value === undefined, value: value }
      }
    }

    if (dataTypeSupport.iterable) {
      let iteratorSymbol = (<any>self)['Symbol'].iterator;
      iterator[getSymbolIterator()] = () => iterator;
    }

    return iterator
  }

  keys() {
    let items: string[] = [];
    this.forEach((value, name) => items.push(name));

    var iterator: any = {
      next: function() {
        var value = items.shift()
        return { done: value === undefined, value: value }
      }
    }

    if (dataTypeSupport.iterable) {

      iterator[getSymbolIterator()] = () => iterator;
    }

    return iterator
  }

  entries() {
    let items:any = [];
    this.forEach((value, name) => items.push([name, value]));

    var iterator: any = {
      next: function() {
        var value = items.shift()
        return { done: value === undefined, value: value }
      }
    }

    if (dataTypeSupport.iterable) {

      iterator[getSymbolIterator()] = () => iterator;
    }

    return iterator
  }
  [getSymbolIterator()]() {
    return this.entries();
  }

}
