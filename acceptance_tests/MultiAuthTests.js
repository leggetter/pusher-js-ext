$(function(){
  
  Pusher.log = function(msg) {
    console.log(msg);
  };

  module("PusherExt Acceptance Tests");
  
  var APP_KEY = 'c9f5043738b6f7e428fa';
  
  QUnit.reset = function() {
    var instance;
    for(var i = 0, l = Pusher.instances.length; i < l; ++i) {
      instance = Pusher.instances[i];
      if(instance.connection.state === 'connected') {
        instance.disconnect();
      }
    }
  };

  asyncTest("can subscribe to a single public channel", function() {
    canSubscribe('channel');
  });
  
  asyncTest("can subscribe to a single private channel", function() {
    canSubscribe('private-channel');
  });
  
  asyncTest("can subscribe to a single presence channel", function() {
    canSubscribe('presence-channel');
  });
  
  // TODO: refactor these tests
  asyncTest("can subscribe multiple private channels", function() {
    
    var pusherExt = new PusherExt(APP_KEY, {
      multiPreAuthEndPoint: 'php/multi_pre_auth.php'
    });
    
    pusherExt.connection.bind('connected', function() {
      
      var channels = pusherExt.multiSubscribe(['private-channel1', 'private-channel2']);
      var subscribed = 0;
      var handler = function() {
        ++subscribed;
        
        ok(true, 'Subscribed');
        if(subscribed == 2) {
          start();
        }
      }
      channels['private-channel1'].bind('pusher:subscription_succeeded', handler);
      channels['private-channel2'].bind('pusher:subscription_succeeded', handler);      
    });
    
  });
  
  asyncTest("can subscribe multiple presence channels", function() {
    
    var pusherExt = new PusherExt(APP_KEY, {
      multiPreAuthEndPoint: 'php/multi_pre_auth.php'
    });
    
    pusherExt.connection.bind('connected', function() {
      
      var channels = pusherExt.multiSubscribe(['presence-channel1', 'presence-channel2']);
      var subscribed = 0;
      var handler = function() {
        ++subscribed;
        
        ok(true, 'Subscribed');
        if(subscribed == 2) {
          start();
        }
      }
      channels['presence-channel1'].bind('pusher:subscription_succeeded', handler);
      channels['presence-channel2'].bind('pusher:subscription_succeeded', handler);      
    });
    
  });
  
  asyncTest("can subscribe public, private and presence channels", function() {
    
    var pusherExt = new PusherExt(APP_KEY, {
      multiPreAuthEndPoint: 'php/multi_pre_auth.php'
    });
    
    pusherExt.connection.bind('connected', function() {
      
      var channels = pusherExt.multiSubscribe(['public-channel1', 'private-channel1', 'presence-channel2']);
      var subscribed = 0;
      var handler = function() {
        ++subscribed;
        
        ok(true, 'Subscribed');
        if(subscribed == 3) {
          start();
        }
      }
      channels['public-channel1'].bind('pusher:subscription_succeeded', handler);
      channels['private-channel1'].bind('pusher:subscription_succeeded', handler);
      channels['presence-channel2'].bind('pusher:subscription_succeeded', handler);      
    });
    
  });
  
  function canSubscribe(channelName) {
    var pusherExt = new PusherExt(APP_KEY, {
      multiPreAuthEndPoint: 'php/multi_pre_auth.php'
    });
    
    pusherExt.connection.bind('connected', function() {
      
      var channels = pusherExt.multiSubscribe([channelName]);
      var channel = channels[channelName];
      channel.bind('pusher:subscription_succeeded', function() {
        ok(true, 'Subscribed');
        start();
      });
      
    });
  }
  
});