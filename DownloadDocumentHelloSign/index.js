const search = require('./searches/document');

const authentication = {
  type: 'custom',
  // "test" could also be a function
  test: {
    url:
      'https://api.hellosign.com/v3/account'
  },
  fields: [
    {
      key: 'api_key',
      type: 'string',
      required: true,
      helpText: 'Your HelloSign API key. Available in Settings > API'
    }
  ]
};

const addApiKeyToHeader = (request, z, bundle) => {
  const basicHash = Buffer(`${bundle.authData.api_key}:`).toString('base64');
  request.headers.Authorization = `Basic ${basicHash}`;
  return request;
};

const stashPDFfunction = (z, bundle) => {
  // use standard auth to request the file
  const url = 'https://api.hellosign.com/v3/signature_request/files/';
  z.console.log("Constructed URL: " + url + bundle.inputData.signature_request_id);
  const filePromise = z.request({
    url: url + bundle.inputData.signature_request_id,
    raw: true
  });
  // and swap it for a stashed URL
  return z.stashFile(filePromise);
};

// Now we can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,
  beforeRequest: [addApiKeyToHeader],
  
  hydrators: {
    stashPDF: stashPDFfunction
  },

  afterResponse: [
  ],

  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [search.key]: search
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
