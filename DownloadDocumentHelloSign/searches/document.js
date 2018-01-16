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
        helpText: 'The ID of the HelloSign signature request for which you want to retrieve a document'
      }
    ],

    perform: (z, bundle) => {
      const url = 'https://api.hellosign.com/v3/signature_request/files/';

      // Put the search value in a query param. The details of how to build
      // a search URL will depend on how your API works.
      //~ const options = {
        //~ params: {
          //~ search: bundle.inputData.signature_request_id
        //~ }
      //~ };

      //~ return z.request(url + bundle.inputData.signature_request_id)
        //~ .then(response => JSON.parse(response.content));

		//~ return _.map(records, function(record) {
		  //~ // if you just do url, we'll include any standard authentication headers
		  //~ record.file = z.dehydrateFile('https://yoursite.com/files/download/' + bundle.inputData.signature_request_id);
		  //~ return record;
		//~ });
		const fileRequest = z.request({url: url + bundle.inputData.signature_request_id, raw: true});
		var result = [{ "file" : z.stashFile(fileRequest) }];
		return result;
    },
    
    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 1,
      createdAt: 1472069465,
      name: 'Best Spagetti Ever',
      authorId: 1,
      directions: '1. Boil Noodles\n2.Serve with sauce',
      style: 'italian'
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'createdAt', label: 'Created At'},
      {key: 'name', label: 'Name'},
      {key: 'directions', label: 'Directions'},
      {key: 'authorId', label: 'Author ID'},
      {key: 'style', label: 'Style'}
    ]
  }
};
