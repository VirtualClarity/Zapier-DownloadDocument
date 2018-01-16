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
    //~ [search.key]: search
	get_document: {
	  key: 'get_document',

	  // You'll want to provide some helpful display labels and descriptions
	  // for users. Zapier will put them into the UX.
	  noun: 'Document',
	  display: {
		label: 'Get a Document',
		description: 'Retrieve the document for a specific signing request'
	  },

	  // `operation` is where we make the call to your API to do the search
	  operation: {
		// This search only has one search field. Your searches might have just one, or many
		// search fields.
		inputFields: [
		  {
			key: 'signature_request_id',
			type: 'string',
			label: 'Signature Request ID',
			helpText: 'The ID of the HelloSign signature request for which you want to retrieve a document'
		  }
		],

		perform: (z, bundle) => {

			var result = [{ "file" : z.dehydrate(stashPDFfunction, bundle.inputData.signature_request_id) }];
			return result;
		},
		
		// In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
		// from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
		// returned records, and have obviously dummy values that we can show to any user.
		sample: {
			file: "File object for use in other stpes of your Zap"
		},

		// If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
		// field definitions. The result will be used to augment the sample.
		// outputFields: () => { return []; }
		// Alternatively, a static field definition should be provided, to specify labels for the fields
		outputFields: [
		  {key: 'file', label: 'File object for use in other steps of your Zap'}
		]
	  }
	}
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
