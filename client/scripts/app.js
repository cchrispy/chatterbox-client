//TODO: 
  //make friends list
  //available rooms list
  //make new room
  //display friend's messages in bold
  //private messages???
  //update messages every 2 seconds


var app = {};
app.server = 'https://api.parse.com/1/classes/messages';

// var messages = {};

app.init = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    success: function() {
      console.log('init worked');
    },
    error: function() {
      console.log('init failed');
    }
  });
};

app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data, status, jqXHR) {
      console.log('message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data, status, jqXHR) {
      var sortedData = sortByTime(data); // keys are the time, values are the objects
      console.log(sortedData);
      for (var prop in sortedData) {
        app.addMessage(sortedData[prop]);
      }

      // console.dir(sortedData);
      // d3.select('#chats').selectAll('.messageBox').data(sortedData, function(d) {
      //   console.log(d);
      //   app.addMessage(d[d.time]);
      //   return d.time;
      // });
      // .enter().call(function(d) { console.log(d.time); }); // d[d.time]
      // can use d3 to add the old messages (use .enter())
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function(message) {
  var $username = $('<a>', {'class': 'username', 'href': '#', 'onclick': 'app.addFriend()'}).text(escapeText(message.username));
  var $time = $('<span>', {'class': 'timeStamp'}).text(timeStamp(message));
  var $msg = $('<span>', {'class': 'message'}).text(escapeText(message.text));
  var $fullMessage = $('<div>', {'class': 'messageBox'}).append($username, '<br>', $time, '<br>', $msg);
  if (!message.roomname) {
    $('#chats').prepend($fullMessage);
  } else {
    if (message.roomname && message.roomname.indexOf('script') === -1) {
      app.addRoom(message);
      $('#' + message.roomname.split(' ').join('').toLowerCase()).prepend($fullMessage);
    }
  }
};

app.addRoom = function(data) {
  console.log(data.roomname);
  if (data.roomname && data.roomname.indexOf('script') === -1) {
    var roomExists = _.reduce($('#roomSelect > option'), function(found, nextRoom) {
      if (found) {
        return true;
      } else {
        return nextRoom.getAttribute('value') === data.roomname.toLowerCase();
      }
    }, false);
    if (!roomExists) { // create new room if the room doesn't exist already
      var roomString = data.roomname[0].toUpperCase() + data.roomname.slice(1);
      var $newRoom = $('<option>', {'value': data.roomname.toLowerCase()}).text(roomString);
      $('#roomSelect').append($newRoom);
      $('#allRooms').append($('<div>', {'id': data.roomname.split(' ').join('').toLowerCase()}));
    }
  }
};

app.addFriend = function() {
  console.log('adding friend');
};

app.handleSubmit = function() {
  console.log('sent button clicked');
  var msg = $('#message').val();
  console.log(msg);
  app.send({
    username: location.search.split('=')[location.search.split('=').length - 1],
    text: '' + msg + '',
  });
  app.fetch();
};

var escapeText = function(text) {
  if (text) {
    return text.split('script').join('').split('<').join('').split('>').join('').split('%').join('').split('console.log').join('');
  } else {
    return text;
  }
};

var timeStamp = function(obj) {
  if (obj) {
    return obj.createdAt.split('T')[1].split('.')[0];
  }
};

var sortByTime = function(data) {
  var sorted = {};
  for (var i = 0; i < data.results.length; i++) {
    var time = timeStamp(data.results[i]);
    var hour = +time.split(':')[0];
    var minute = +time.split(':')[1];
    var seconds = +time.split(':')[2];
    var total = hour * 3600 + minute * 60 + seconds;
    sorted[total] = data.results[i];
  }
  return sorted;
};

$(document).ready(function() {
  app.init();
  app.fetch();
  // setInterval(app.fetch, 5000);
  $('body').on('change', '#roomSelect', function() {
    console.log('lalalalala');
    var selectedRoom = $(this).val().split(' ').join('').toLowerCase();
    $('#allRooms').children().css('display', 'none');
    $('#' + selectedRoom).slideDown();

  });
});









