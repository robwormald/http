import {HttpMethod} from './enums'

export interface HttpRequestOptions {
  url?: string;
  method?: string | HttpMethod;
 // search?: string | URLSearchParams;
 // headers?: Headers;
  // TODO: Support Blob, ArrayBuffer, JSON, URLSearchParams, FormData
  body?: string;
}
