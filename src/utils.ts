const root:any = (typeof self && self) || (typeof window && window);

export const dataTypeSupport = (() => {
  return {
    searchParams: 'URLSearchParams' in root,
    nativeFetch: 'fetch' in root && 'Response' in root,
    iterable: 'Symbol' in root && 'iterator' in root['Symbol'],
    blob: 'FileReader' in root && 'Blob' in root && (() => {
      try {
        new Blob();
        console.log('yay blob')
        return true;
      } catch (error) {
        console.log('no blob')
        return false;
      }
    })(),
    formData: 'FormData' in root,
    arrayBuffer: 'ArrayBuffer' in root
  }
})();

