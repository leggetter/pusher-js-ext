# The Pusher JS Ext library

This library is used as a playground for functionality that might be considered to be added to the Pusher core JavaScript library.

Functionality will be made available without the need to modify any other library. This should include the Pusher core JavaScript library and any server libraries.

## Alpha Functionality in library

The functionality that must be considered as Alpha that is present within this library is:

### The ability to subscribe to multiple subscriptions within a single call

    var pusher = new Pusher('YOUR_APP_KEY');
    pusherExt = new PusherExt(pusher, {
      multiPreAuthEndPoint: 'php/multiPreAuth.php'
    });
    var channels = pusherExt.multiSubscribe(['channel', 'private-channel', 'presence-channel']);
    var publicChannel = channels['channel'];
    var privateChannel = channels['private-channel'];
    var presenceChannel = channels['presence-channel'];
    
For additional usage see the acceptance tests in:
`acceptance_tests/PusherExtTests.js`
    
#### TODO

1. Subscriptions can only be made once the connection is in a 'connected' state because the `pusher.connection.socket_id` hasn't been set. Need to have pending subscriptions.
2. If connection is lost each subscription will be subscribed to individually.
3. At the moment the `PusherExt` object holds a reference to the `Pusher` object. Inheritance is probably a better way of doing this.