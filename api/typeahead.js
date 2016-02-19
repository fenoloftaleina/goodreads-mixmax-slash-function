var _ = require('underscore');
var goodreads_api = require('../lib/goodreads_api');

module.exports = function(req, res) {
  var query = req.query.text.trim();

  try {
    res.json(mapped_search_results(goodreads_api.search(query)));
  } catch (e) {
    res.status(500).send(e);
  }
};

function mapped_search_results(results) {
  if(results.length === 0) {
    return [{ title: '<i>(no results)</i>', text: '' }];
  }

  return _.map(results, function(result) {
    return {
      title: result.html,
      text: 'https://www.goodreads.com/book/show/' + result.id
    };
  });
}
