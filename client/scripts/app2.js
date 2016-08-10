var app = {
  init: function() {
    app.$chats = $('#chats');

    app.objectID = 0;
    app.messages = [];
    app.username = location.search.split('=')[location.search.split('=').length - 1];
    app.roomname = 'lobby';
    app.server = 'https://api.parse.com/1/classes/messages';
    app.rooms = {};
    // event listeners here

    app.fetch();

    $('body').on('submit', 'form', app.handleSubmit);
    $('body').on('change', 'select', app.roomChange);

  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message), // COME BACK TO THIS
      success: function (data) {
        console.log('message sent');
      },
      error: function (error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      success: function (data) {
        console.log(data);
        app.messages = data.results;
        if (app.messages[0].objectId !== app.objectID) {
          var messagesFilteredByRoom = app.messages.filter(function(message) {
            return message.roomname === app.roomname;
          });
          app.displayMessages(messagesFilteredByRoom);
        }
        app.objectID = app.messages[0].objectId;
      },
      error: function(error) {
        console.error('failed to fetch', error);
      } 
    }); 
  },

  displayMessages: function(messages) {
    messages.forEach(app.displayOneMessage);
    messages.forEach(function(message) {
      if (message.roomname === undefined || message.roomname === '') {
        app.addRoom('lobby');
      } else {
        app.addRoom(message.roomname);
      }
    });
  },

  displayOneMessage: function(message, ourmessage) {
    var $username = $('<a class="username" href="#">').text(message.username);
    var $msg = $('<span class="message">').text(message.text);
    var $fullMessage = $('<div class="messageBox">').append($username).append($('<br>')).append($msg);
    if (ourmessage === true) {
      app.$chats.prepend($fullMessage);
    } else {
      app.$chats.append($fullMessage);
    }
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var textMessage = $('#message').val();
    var msg = {
      username: location.search.split('=')[location.search.split('=').length - 1],
      text: textMessage,
      roomname: app.roomname || 'lobby'
    };
    app.displayOneMessage(msg, true);
    app.send(msg);
  },

  addRoom: function(roomname) {
    $newRoom = $('<option>').val(roomname).text(roomname);
    if (!app.rooms[roomname]) {
      app.rooms[roomname] = roomname;
      $('#roomSelect').append($newRoom);
    }
  },

  roomChange: function() {
    var newRoom = $('select').val();
    app.roomname = newRoom;
  },



};


$(document).ready(function() {
  app.init();
});