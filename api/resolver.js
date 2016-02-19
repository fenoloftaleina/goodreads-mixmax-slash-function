var goodreads_api = require('../lib/goodreads_api');

module.exports = function(req, res) {
  var text = req.query.text.trim();

  var book = findByIdOrFirstFromSearch(text);
  if(!book) {
    res.status(422).send();
    return;
  }

  try {
    res.json({
      body: book.html
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

function findByIdOrFirstFromSearch(text) {
  var id_match = text.match(/^https:\/\/www\.goodreads\.com\/book\/show\/(\d+)/);
  if(id_match) {
    return goodreads_api.find(id_match[1]);
  } else {
    return goodreads_api.search(text)[0];
  }
}
