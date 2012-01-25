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

The code for the server authentication can be seen in:
`acceptance_tests/multiPreAuth.php`

The JSON response from the authentication endpoint should look the same as a standard authentication response but the auth for each channel should be identified within a hash:

    {
      "private-channel1":"{\"auth\":\"c9f5043738b6f7e428fa:00b91a51f643fbd969351f47650e668bf5d312800963509b56a12cb0d8504800\"}",
      "private-channel2":"{\"auth\":\"c9f5043738b6f7e428fa:f02e31d43de2bc799e3f023e9c3ad9228af084aded4ebdf8846dd935889099a9\"}",
      "private-channel3":"{\"auth\":\"c9f5043738b6f7e428fa:cb15298d5e2135cb05edda5a8b0c84b5715a0dc3e43ae9532b1717c334bb2797\"}"
    }
    
#### TODO

1. Subscriptions can only be made once the connection is in a 'connected' state because the `pusher.connection.socket_id` hasn't been set. Need to have pending subscriptions.
2. If connection is lost each subscription will be subscribed to individually.
3. At the moment the `PusherExt` object holds a reference to the `Pusher` object. Inheritance is probably a better way of doing this.