module.exports = {
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
			helpText: 'The ID of the HelloSign signature request for which you want to retrieve a document',
			required: true
		  },
		  {
			key: 'title',
			type: 'string',
			label: 'Document Title',
			helpText: 'The title of the document. The file name will be based on this.',
			required: true
		  }
		],

		perform: (z, bundle) => {
			
			var result = [{ "file" : z.dehydrate(stashPDFfunction, bundle.inputData),
							"filename" : bundle.inputData.title,
							"extension": ".pdf"}];
			return result;
		},
		
		// In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
		// from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
		// returned records, and have obviously dummy values that we can show to any user.
		sample: {
			file: "(Downloaded document in binary format)",
			filename: "My Signed Document",
			extension: ".pdf"
		},

		// If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
		// field definitions. The result will be used to augment the sample.
		// outputFields: () => { return []; }
		// Alternatively, a static field definition should be provided, to specify labels for the fields
		outputFields: [
		  {key: 'file', label: 'File object for use in other steps of your Zap'},
		  {key: 'filename', label: 'Title of the document'},
		  {key: 'extension', label: 'File extension of the document; always .pdf for now'}
		]
	  }
};
