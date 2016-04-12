import {dataTypeSupport} from './utils'
import {HttpHeaders} from './headers'

const wrapFileReader = reader => {
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  }).then(result => {
    console.log('fileread', result['byteLength']);
    return result;
  })
}

const readBlobAsArrayBuffer = blob => {
  console.log('reading blob')
  var reader = new FileReader();
  reader.readAsArrayBuffer(blob);
  return wrapFileReader(reader);
}

const readBlobAsText = blob => {
  var reader = new FileReader();
  reader.readAsText(blob);
  return wrapFileReader(reader);
}

const decode = body => {
  var form = new FormData()
  body.trim().split('&').forEach((bytes) => {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}


export class HttpBody {
  headers: HttpHeaders;
  protected _body: any;
  private _text: string;
  private _blob: Blob;
  private _formData: FormData;
  protected _init(body) {

    this._body = body;
    if (typeof body === 'string') {
      this._text = body;
    }
    else if (dataTypeSupport.blob && Blob.prototype.isPrototypeOf(body)) {
      console.log('isblob')
      this._blob = body;
    }
    else if (dataTypeSupport.formData && FormData.prototype.isPrototypeOf(body)) {
      this._formData = body;
    }
    else if (dataTypeSupport.searchParams && self['URLSearchParams'].prototype.isPrototypeOf(body)) {
      this._text = body.toString();
    }
    else if (!body) {
      this._text = '';
    }
    else if (dataTypeSupport.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
      //noop
    }
    else {
      throw new Error('unsupported body type!');
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._blob && this._blob.type) {
        this.headers.set('content-type', this._blob.type)
      } else if (dataTypeSupport.searchParams && self['URLSearchParams'].prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  text(): Promise<any> {
    if (this._blob) {
          return readBlobAsText(this._blob)
        } else if (this._formData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._text)
        }
  }

  json(): Promise<any> {
    //use native fetch to async parse JSON where available
    if (dataTypeSupport.nativeFetch) {
      let res = self['Response'];

      (this._text);
      return this.text().then(text => {
        return new res(text).json();
      })
    }
    else {
      return this.text().then(JSON.parse);
    }
  }

  blob(): Promise<Blob> {
    if (this._blob) {
      console.log('using blob')
      return Promise.resolve(this._blob);
    }
    else if (this._formData) {
      throw new Error('could not parse FormData into Blob');
    }
    else {
      console.log('using text')
      return Promise.resolve(new Blob([this._text]));
    }
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return this.blob().then(readBlobAsArrayBuffer);
  }

  formData(): Promise<FormData> {
    return this.text().then(decode);
  }
}
