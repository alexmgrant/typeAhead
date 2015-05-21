'use strict';
// ROB: Method names in this file should probably be alphabetized.
var App = {};

// ROB: Moved "lodash" definition here so that it is separate from the main app code.
//      Ideally it would be extracted into a different JS file.
var _ = {
  compact: function (array) {
    // ROB: I aligned these on = signs.
    var index = -1,
      length = array ? array.length : 0,
      resIndex = -1,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  }
};

App.init = function () {
  App.DONE_TYPING_INTERVAL = 800;
  App.searchTerm();
};

App.getActorNames = function (actors) {
    return actors;
};

App.makeUL = function (array) {
  // Create the list element:
  var list = document.createElement('ul');

  for (var i = 0; i < array.length; i++) {
    // Create the list item:
    var item = document.createElement('li');

    // ROB: I checked, and createTextNode() should be safe from XSS.
    //      You might want to leave a comment indicating this.
    // Set its contents:
    item.appendChild(document.createTextNode(array[i].input));

    // Add it to the list:
    list.appendChild(item);
  }

  // Finally, return the constructed list:
  return list;
};

App.getData = function () {
  // ROB: I would refactor the mock data into its own method.
  //      getData() should only get the data, then grab actor
  //      names then return them. Even better, implement a
  //      Data service, or similar, which returns the actor names.
  var amazonMock =
    [
      {
        "type": "add",
        "id": "tt0484562",
        "fields": {
          "title": "The Seeker: The Dark Is Rising",
          "directors": ["Cunningham, David L."],
          "genres": ["Adventure", "Drama", "Fantasy", "Thriller"],
          "actors": ["McShane, Ian", "Eccleston, Christopher", "Conroy, Frances",
            "Crewson, Wendy", "Ludwig, Alexander", "Cosmo, James",
            "Warner, Amelia", "Hickey, John Benjamin", "Piddock, Jim",
            "Lockhart, Emma"]
        }
      },
      {
        "type": "delete",
        "id": "tt0484575"
      }];

  return App.getActorNames(amazonMock[0].fields.actors);
};

App.searchTerm = function () {
  //setup before functions
  var typingTimer;                //timer identifier
  var el;
  var results;
  var searchResults = $('#results');
  var searchInput = $('#searchBox');
  // ROB: I would bind events to a method *name*, rather than inlining the
  //      method body inside of the inputValue() function. That way, inputValue()
  //      can be renamed to something like bindEvents(), and the body of the anonymous
  //      function below could be renamed to something like App.inputChangedListener().

  searchInput.bind("keyup paste", function () {
    el = $(this);
    results = _.compact(App.searchStringInArray(el.val(), App.getData()));
    searchResults.children().remove();
    searchResults.append(App.makeUL(results));
  })
};

App.searchStringInArray = function (str, strArray) {
  // ROB: Is .match() faster than .indexOf()?
  //      No! Turns out .test() is fastest! But in any event .match() is very slow!
  //      https://jsperf.com/exec-vs-match-vs-test-vs-search/11
  return strArray.map(function (name) {
    return name.match(str);
  });
};

$(document).ready(function () {
  App.init();
});
