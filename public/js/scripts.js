// ROB: 'use strict' is missing.
//
// ROB: Method names in this file should probably be alphabetized.

var App = {};

// ROB: Moved "lodash" definition here so that it is separate from the main app code.
//      Ideally it would be extracted into a different JS file.
var _ = {
  compact: function (array) {
    // ROB: I aligned these on = signs.
    var index  = -1,
      length   = array ? array.length : 0,
      resIndex = -1,
      result   = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[++resIndex] = value;
      }
    }
    return result;
  }
};

// ROB: Why is this method name uppercased?
App.Init = function () {
  // ROB: inputValue() does not make sense as a method name, at least to me.
  App.inputValue();
};

App.getActorNames = function (actors) {
  return actors.map(function (name) {
    return name;
  })
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

App.inputValue = function () {
  //setup before functions
  var typingTimer;                //timer identifier

  // ROB: Constants should be defined at the highest level of reuse, and in uppercase.
  //      This one should probably be App.DONE_TYPING_INTERVAL.
  var doneTypingInterval = 800;

  // ROB: jQuery reference to #searchBox should be cached for future reuse.
  //
  // ROB: Binding to three events creates a potential performance problem.
  //      When I type an uppercase "I", pushing the "i" key counts as a 'change'
  //      event, and releasing the Shift key counds as a 'keyup' event. Therefore
  //      this callback fires *twice* when it should only fire once.
  //
  // ROB: I would bind events to a method *name*, rather than inlining the
  //      method body inside of the inputValue() function. That way, inputValue()
  //      can be renamed to something like bindEvents(), and the body of the anonymous
  //      function below could be renamed to something like App.inputChangedListener().
  $("#searchBox").bind("change keyup paste", function () {
    console.log('change');
    clearTimeout(typingTimer);
    // ROB: What does this timeout do? As far as I can tell it does nothing.
    //      I commented it out and nothing seems to break!
    typingTimer = setTimeout(doneTyping, doneTypingInterval);

    // ROB: A reference to this selector could be cached for increased performance.
    var el = $(this);
    // Save current value of element
    el.data('oldVal', el.val());

    // ROB: Re-defining this function with every keystroke is a small performance loss.
    //user is "finished typing," do something
    function doneTyping() {
      // ROB: Why use 'oldVal'? Why not just take the current .val() from the element?
      //      If the user has stopped typing, then .val() should be the same as 'oldVal'.
      //
      // ROB: Why does this timeout callback return a value? Nothing is going to
      //      consume that value.
      return _.compact(App.searchStringInArray(el.data('oldVal'), App.getData()));
    }

    // ROB: jQuery reference to #results should be cached for future reuse.
    //      For example: var $results = $('#results');
    $('#results').children().remove();
    $('#results').append(App.makeUL(doneTyping()));
  })
};

App.searchStringInArray = function (str, strArray) {
  for (var j = 0; j < strArray.length; j++) {
    // ROB: Is .match() faster than .indexOf()?
    //      No! Turns out .test() is fastest! But in any event .match() is very slow!
    //      https://jsperf.com/exec-vs-match-vs-test-vs-search/11
    if (strArray[j].match(str)) {
      // ROB: I don't understand why you are using .map() inside the for loop.
      //      It looks like just using .map() would do what you want.
      //      I removed the outer for loop and conditional and everything still worked!
      return strArray.map(function (name) {
        return name.match(str);
      })
    }
  }
  return -1;
};

// ROB: I thought jQuery was not allowed?
$(document).ready(function () {
  App.Init();
});
