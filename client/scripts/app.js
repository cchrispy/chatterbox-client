// YOUR CODE HERE:

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
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data, status, jqXHR) {
      console.log('chatterbox: fetched messages');
      console.log(data);
      // console.log('status' + status);
      // console.log(jqXHR);
      _.each(data.results, function(item) {
        messages[item.text] = item;
      });
      // _.each(data.results, function(item) {
      //   if (item.text) {
      //     app.addMessage(item);  
      //   }
      // });
      _.each(messages, function(item, key) {
        app.addMessage(item);
      });
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
  $('#chats').prepend('<div>' + timeStamp(message) + ' <span class="username" onclick="app.addFriend()">' + escapeText(message.username) + '</span>: <span class="message">' + msg + '</span></div>');
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
  return obj.createdAt.split('T')[1].split('.')[0];
};

// var msg = {
//   username: 'chris',
//   text: 'hello everybody',
//   roomname: 'lobby'
// };
// app.init();
// app.send(msg);
// app.fetch();
$(document).ready(function() {
  app.init();
  app.fetch();

});
// app.init();
// app.fetch();

