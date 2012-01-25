# The Pusher JS Ext library

This library is used as a playground for functionality that might be considered to be added to the Pusher core JavaScript library.

Functionality will be made available without the need to modify any other library. This should include the Pusher core JavaScript library and any server libraries.

## Inheritance

The `PusherExt` object inherits from the `Pusher` object so you can use it as you do the Pusher object.

## How to use the library

1. Include the standard Pusher library
2. Include the PusherExt library

        <script src="http://js.pusher.com/1.11/pusher.min.js"></script>
        <script src="some_path/PusherExt.js"></script>
        <script>
          var options = {/* options */};
          var pusherExt = new PusherExt('APP_KEY', options);
        </script>
    
3. Since the `PusherExt` object extends the `Pusher` object you can use it as you do the `Pusher` object.

## Alpha Functionality in library

The functionality that must be considered as Alpha that is present within this library is:

### The ability to subscribe to multiple subscriptions within a single call

    var pusherExt = new PusherExt('YOUR_APP_KEY', {
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

### The ability to send additional parameters to the server with the subscription authentication AJAX call

**Request:** <http://pusher.tenderapp.com/discussions/requests/15-i-want-to-be-able-to-append-request-parameters-to-private-and-presence-channel-authentication-requests-eg-a-csrf-token>

By using the `PusherExt` object it is possible to use pass additional parameters to the `Pusher.channel_auth_endpoint` by passing in additional options to the `PusherExt` constructor.

    var px = new PusherExt('MY_APP_KEY', {
      authParams: {
        CSRFToken: 'SOME AWESOME TOKEN'
      }
    });
    
In the example above a `CSRFToken` parameter with a value of `SOME AWESOME TOKEN` will be passed along with the `socket_id` and `channel_name` parameters to the authentication endpoint.
    
#### TODO:

1. The ability to set parameters on an individual authentication call basis.