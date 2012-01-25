$(function(){
    
  module("Additional Auth Param Tests");

  test("ajax auth is overridden", function() {
    
    equals(PusherExt.ajaxAuth, Pusher.authorizers.ajax);
  });

  test("Additional params can be passed in the options", function() {
    
    var instances = [];
    Pusher.XHR = function() {
      instances.push(this);
      
      this.sendData = null;
      this.send = function(data) {
        this.sendData = data;
      }
      
      this.open = function() {};
      this.setRequestHeader = function() {};
    };
    
    var px = new PusherExt('MY_APP_KEY', {
      authParams: {
        CSRFToken: 'SOME AWESOME TOKEN'
      }
    });
    
    PusherExt.ajaxAuth(px, function(error, data) {});
     
    ok(instances[0], 'an instance has been created');
    ok(instances[0].sendData.indexOf('CSRFToken') > -1, 'CSRFToken was sent');
  });

});