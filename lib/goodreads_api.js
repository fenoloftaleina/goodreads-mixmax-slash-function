var key = require('./key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var parseString = require('xml2js').parseString;

module.exports = {
  search: function(query) {
    return getBooks(parseXML(searchGoodreads(query)));
  },

  find: function(book_id) {
    return getBook(parseXML(findGoodreads(book_id)));
  }
};

function searchGoodreads(query) {
  return sync.await(request({
    url: 'https://www.goodreads.com/search/index.xml',
    qs: {
      key: key,
      q: query
    },
    gzip: true,
    json: false,
    timeout: 15 * 1000
  }, sync.defer()));
}

function parseXML(response) {
  var json_result;
  parseString(response.body, function (err, result) {
    if(err) {
      throw(err);
    }

    json_result = result.GoodreadsResponse;
  });

  return json_result;
}

function getBooks(results) {
  if(!results) {
    return [];
  }

  var works = results.search[0].results[0].work;
  return _.map(works, function(work) {
    return presentBook(work.best_book[0]);
  });
}

function getBook(result) {
  if(!result) {
    return;
  }

  return presentBook(result.book[0]);
}

function presentBook(book) {
  var title = book.title[0];
  var authors = allAuthors(
    book.author || _.map(book.authors[0], function(a) { return a[0]; })
  );
  var image_url = book.small_image_url;

  return {
    html: '<div style="width: 300px; padding: 5px 0px;  overflow: hidden;">' +
      '<img src="' + image_url + '" style="float: left; margin-right: 10px;"' +
        '/>' + title + '<br /><span style="color: #afafaf;">' + authors +
          '</span></div>',
    id: book.id[0]._
  };
}

function allAuthors(arr) {
  return _.map(arr, function(author) { return author.name[0]; }).join(', ');
}

function findGoodreads(id) {
  return sync.await(request({
    url: 'https://www.goodreads.com/book/show',
    qs: {
      key: key,
      id: id
    },
    gzip: true,
    json: false,
    timeout: 15 * 1000
  }, sync.defer()));
}
