var App = {};
var _ = {}; //for lodash

App.Init = function () {
  App.inputValue();
};

App.getActorNames = function (actors) {
  return actors.map(function (name) {
    return name;
  })
};

_.compact = function (array) {
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
};

App.makeUL = function (array) {
  // Create the list element:
  var list = document.createElement('ul');

  for (var i = 0; i < array.length; i++) {
    // Create the list item:
    var item = document.createElement('li');

    // Set its contents:
    item.appendChild(document.createTextNode(array[i].input));

    // Add it to the list:
    list.appendChild(item);
  }

  // Finally, return the constructed list:
  return list;
};

App.getData = function () {
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
  var doneTypingInterval = 800;

  $("#searchBox").bind("change keyup paste", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);

    var el = $(this);
    // Save current value of element
    el.data('oldVal', el.val());

    //user is "finished typing," do something
    function doneTyping() {
      return _.compact(App.searchStringInArray(el.data('oldVal'), App.getData()));
    }

    $('#results').children().remove();
    $('#results').append(App.makeUL(doneTyping()));
  })
};

App.searchStringInArray = function (str, strArray) {
  for (var j = 0; j < strArray.length; j++) {
    if (strArray[j].match(str)) {
      return strArray.map(function (name) {
        return name.match(str);
      })
    }
  }
  return -1;
};

$(document).ready(function () {
  App.Init();
});
