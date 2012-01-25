var DummyConnection = function() {
  this.socket_id = 'some_socket_id';
  this.state = 'connected';
};
var DummyChannel = function(name) {
  this.name = name;
};
var DummyPusher = function() {
  this.subscribeCalls = [];
  this.connection = new DummyConnection();
};
DummyPusher.prototype.subscribe = function(name) {
  this.subscribeCalls.push(arguments);
  return new DummyChannel(name)
}

DummyPusher.channel_auth_transport = null;
DummyPusher.authorizers = {};
DummyPusher.error = function(){};
DummyPusher.warn = function(){};

Pusher = DummyPusher;