$(function(){
    
  module("PusherExt Tests");

  test("PusherExt is decorated with public functions", function() {
    
    var px = new PusherExt('MY_APP_KEY');
    
    ok(typeof px.subscribe === 'function');
  });
  
  test("public channels are subscribed to without auth", function() {
    
    var px = new PusherExt('MY_APP_KEY');
    
    px.multiSubscribe(['channel1']);
    
    equals(px.subscribeCalls.length, 1);
  });
  
  test("Pusher.channel_auth_transport is set to multPreAuth if multiPreAuthEndPoint is set", function() {
    
    var px = new PusherExt('MY_APP_KEY', {multiPreAuthEndPoint:'/fish'});
    
    equals(Pusher.channel_auth_transport, 'multPreAuth');
  });
  
  test("Pusher.authorizers.multPreAuth is appended if multiPreAuthEndPoint is set", function() {
    
    var px = new PusherExt('MY_APP_KEY', {multiPreAuthEndPoint:'/fish'});
    
    equals(PusherExt.multiPreAuth, Pusher.authorizers['multPreAuth']);
  });
  
  test("single channel is returned from multiSubscribe call", function() {
    
    var px = new PusherExt('MY_APP_KEY');
    
    var channels = px.multiSubscribe(['channel1']);
    
    equals(countHashElements(channels), 1);
  });
  
  test("test multiSubscribe returns hash of channel name to Channel objects", function() {
    
    var px = new PusherExt('MY_APP_KEY');
    
    var channels = px.multiSubscribe(['channel1', 'channel2']);
    
    equals(channels['channel1'].name, 'channel1');
    equals(channels['channel2'].name, 'channel2');    
  });  
  
  test("test calling multiSubscribe with once private channel calls pusher.subscribe", function() {
    
    var px = new PusherExt('MY_APP_KEY', {multiPreAuthEndPoint:'/multi_pre_auth'});
    px._doAjax = function() {}; // stop AJAX call occuring
    
    px.multiSubscribe(['private-channel1']);
    
    px._multiAuthAjaxCallback(false, { 'channel1': {auth:'some_auth_string'} });
    
    equals(px.subscribeCalls.length, 1);
  });
  
  test("multiSubscribe calls multiPreAuth with 2 channels (private and presence)", function() {

    var px = new PusherExt('MY_APP_KEY', {multiPreAuthEndPoint:'/multi_pre_auth'});
    
    var subscribeToChannels = ['private-channel1', 'presence-channel2'];
    
    var multiAuthArgs = null;
    px._multiAuth = function(channels, callback) {
      multiAuthArgs = arguments;
    };
    
    px.multiSubscribe(subscribeToChannels);
    
    var actualChannels = multiAuthArgs[0];
    equal(2, actualChannels.length);
    ok( arrayContains(actualChannels, subscribeToChannels[0]) );
    ok( arrayContains(actualChannels, subscribeToChannels[1]) );
  });
  
  test("multiSubscribe calls multiPreAuth with no channels", function() {

    var px = new PusherExt('MY_APP_KEY', {multiPreAuthEndPoint:'/multi_pre_auth'});
    
    var subscribeToChannels = ['channel1', 'channel2'];
    
    var multiAuthArgs = null;
    px._multiAuth = function(channels, callback) {
      multiAuthArgs = arguments;
    };
    
    px.multiSubscribe(subscribeToChannels);
    
    equal(0, multiAuthArgs[0]);
  });
  
  function arrayContains(array, contains) {
    for(var i = 0, l = array.length; i < l; ++i) {
      if(array[i] === contains) {
        return true;
      }
    }
    return false;
  };
  
  function countHashElements(hash) {
    var count = 0;
    for(var x in hash) {
      ++count;
    }
    return count;
  }

});