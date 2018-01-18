const should = require('should'); // required to use .exist()

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('searches', () => {

  describe('Get Document', () => {
    it('Should retrieve a signed document from HelloSign', (done) => {
      const bundle = {
		authData: {
			api_key: 'c1e8db8f9651b4dbc8701e6967dd95a76c64b08afe7fb8d73d0fb85fb03793e2'
		},
        inputData: {
          signature_request_id: '1713dc8e908664117205303c82d164750796c1b7',
          title: 'My Signed Document'
        }
      };

      appTester(App.searches.get_document.operation.perform, bundle)
        .then(results => {
          results.length.should.be.aboveOrEqual(1);

          const result = results[0];
          result.file.should.match(/^hydrate|||/);
		result.filename.should.equal('My Signed Document');
		result.extension.should.equal('.pdf');
          done();
        })
        .catch(done);
    });
  });

});
