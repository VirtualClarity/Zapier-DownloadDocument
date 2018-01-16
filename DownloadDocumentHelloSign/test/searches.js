const should = require('should'); // required to use .exist()

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('searches', () => {

  describe('search recipe', () => {
    it('should find a recipe', (done) => {
      const bundle = {
		authData: {
			api_key: 'c1e8db8f9651b4dbc8701e6967dd95a76c64b08afe7fb8d73d0fb85fb03793e2'
		},
        inputData: {
          signature_request_id: '1713dc8e908664117205303c82d164750796c1b7'
        }
      };

      appTester(App.searches.get_document.operation.perform, bundle)
        .then(results => {
          results.length.should.be.aboveOrEqual(1);

          const result = results[0];
          console.log(result);
          result.style.should.eql('style 2');
          should.exist(result.name);
          should.exist(result.directions);

          done();
        })
        .catch(done);
    });
  });

});
