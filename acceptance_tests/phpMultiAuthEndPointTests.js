$(function(){

  module("MultiAuth PHP Endpoint Acceptance Tests");

  asyncTest("multi auth endpoint returns auth data for private channels", function() {
    
    var authRequest = {
      socket_id: 'some_socket_id',
      channels: ['private-channel1', 'private-channel2', 'private-channel3']
    };
    
    doXHR(authRequest, function(data) {
      
      var authData = convertAuthData(data);
      
      equals(typeof authData['private-channel1'].auth, 'string');
      
      equals(typeof authData['private-channel2'].auth, 'string');
      
      equals(typeof authData['private-channel3'].auth, 'string');
      
      start();
    })
  });
  
  asyncTest("multi auth endpoint returns auth data for presence channels", function() {
    
    var authRequest = {
      socket_id: 'some_socket_id',
      channels: ['presence-channel1', 'presence-channel2', 'presence-channel3']
    };
    
    doXHR(authRequest, function(data) {
      
      var authData = convertAuthData(data);
      
      for(var i = 0, l = authRequest.channels.length; i < l; ++i) {
        checkPresenceAuthData(authRequest.channels[i], authData)
      }
      
      start();
    })
  });
  
  function convertAuthData(data){
    var authData = {};
    for(var name in data){
      authData[name] = JSON.parse(data[name]);
      if(authData[name].channel_data) {
        authData[name].channel_data = JSON.parse(authData[name].channel_data);
      }
    }
    return authData;
  }
  
  function checkPresenceAuthData(channelName, channelData){
    equals(typeof channelData[channelName].auth, 'string');
    ok( channelData[channelName].channel_data !== undefined );    
    ok( channelData[channelName].channel_data.user_id !== undefined );
  }
  
  function doXHR(authRequest, callback) {
    var xhr = window.XMLHttpRequest ?
      new XMLHttpRequest() :
      new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", 'php/multi_pre_auth.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            data = JSON.parse(xhr.responseText);
          }
          catch(e) {}
          callback(data);
          
        } else {
          throw("Couldn't get multiauth info from your webapp", status);
        }
      }
    };
    var postData = JSON.stringify(authRequest);
    xhr.send(postData);
  };
  
});