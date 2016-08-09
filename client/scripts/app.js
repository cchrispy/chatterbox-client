//TODO: 
  //make friends list
  //available rooms list
  //make new room
  //display friend's messages in bold
  //private messages???
  //update messages every 2 seconds


var app = {};
app.server = 'https://api.parse.com/1/classes/messages';

var messages = {};

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
      console.log('chatterbox: Message sent');
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
      var sortedData = sortByTime(data);
      for (var prop in sortedData) {
        app.addMessage(sortedData[prop]);
      }
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
  var msg = escapeText(message.text);
  $('#chats').prepend('<div class="messageBox"><a href="#" class="username" onclick="app.addFriend()">' 
    + escapeText(message.username) 
    + '</a><br><span class=timeStamp>' 
    + timeStamp(message) 
    + '</span><br><span class="message">' 
    + msg 
    + '</span></div>');
};

app.addRoom = function(room) {
  $('#roomSelect').append('<div>' + room + '</div>');
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
});


