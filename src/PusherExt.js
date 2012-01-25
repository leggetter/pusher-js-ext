(function(module) {

  var PusherExt = function(appKey, options) {
    
    Pusher.call(this, appKey, options);

    this.options = options || {};
    
    this._pendingPreAjax = [];
    this._preAuthAjaxWaiting = 0;
    this._pendingCallbacks = {};
    this._preAuthedChannels = {}
    
    if(this.options.multiPreAuthEndPoint) {
      Pusher.channel_auth_transport = 'multPreAuth';
      
      Pusher.authorizers['multPreAuth'] = PusherExt.multiPreAuth
    }
  };
  extend(PusherExt, Pusher);
  
  /** @private */  
  PusherExt.prototype._checkPendingAuthCallbacks = function() {
    if(this._preAuthAjaxWaiting === 0) {
      var channelInfo;
      var channel;
      var callback;
      var authData;
      var wasError = false;
      for(var channelName in this._pendingCallbacks) {
        channelInfo = this._pendingCallbacks[channelName];
        channel = channelInfo.channel;
        callback = channelInfo.callback;
        authData = this._preAuthedChannels[channel.name];
        if(authData === undefined) {
          Pusher.warn('could not find pre authenticated data for "' + channel.name + '"');
        }
        wasError = (authData.errorStatus !== undefined);
        if(wasError) {
          authData = authData.errorStatus;
        }

        callback(wasError, authData);
      }
    }
  };
  
  PusherExt.prototype.multiSubscribe = function(channels) {
    var sortedChannels = sortChannels(channels);
    this._multiAuth(sortedChannels.requireAuth);
    
    var subscribedChannels = {};
    var channel = null;
    for(var i = 0, l = channels.length; i < l; ++i) {
      channel = this.subscribe(channels[i]);
      subscribedChannels[channel.name] = channel;
    }
    
    return subscribedChannels;
  };
  
  PusherExt.multiPreAuth = function(pusher, callback) {
    // `this` will refer to the channel being authorised.
    var channel = this;
    var self = pusher;
    if(self._pendingCallbacks[channel.name] !== undefined) {
      Pusher.warn('A channel named "' + channel.name + '" is already being authorized.');
    }
    
    self._pendingCallbacks[channel.name] = {channel: channel, callback: callback};
    
    self._checkPendingAuthCallbacks();
  };
  
  /** @private */  
  PusherExt.prototype._multiAuth = function(channels) {
    if(channels.length === 0) {
      return;
    }
    
    if(this.connection.state !== 'connected') {
      Pusher.warn('multiSubscribe does not presently work if not connected');
      this._pendingPreAjax = this._pendingPreAjax.concat(channels);
      return;
    }
    
    var self = this;
    
    var authRequest = {
      socket_id: this.connection.socket_id,
      channels: channels
    };
    
    ++this._preAuthAjaxWaiting;
    this._doAjax(this.options.multiPreAuthEndPoint, authRequest, function() {
      self._multiAuthAjaxCallback.apply(self, arguments);
    });
  };
  
  /** @private */
  PusherExt.prototype._multiAuthAjaxCallback = function(error, data) {
    --this._preAuthAjaxWaiting;
    
    var errorData = null;
    
    if(error) {
      errorData = {
        errorStatus: data
      };
    }
    
    var channelAuthData;
    for(var channelName in data) {
      if(this._preAuthedChannels[channelName] !== undefined) {
        Pusher.warn('A channel called "' + channelName + '" has already be pre-authenticated. The earler pre-authentication will be lost.');
      }
      if(errorData === null) {
        
        try {
          channelAuthData = JSON.parse(data[channelName]);  
        }
        catch(e) {
          channelAuthData = {
            errorStatus: data[channelName]
          };
        }
      }
      else {
        channelAuthData = errorData;
      }
      this._preAuthedChannels[channelName] = channelAuthData;
    }
    
    this._checkPendingAuthCallbacks();
  };
  
  /** @private */  
  PusherExt.prototype._doAjax = function(url, authData, callback) {
    var self = this;

    var xhr = window.XMLHttpRequest ?
      new XMLHttpRequest() :
      new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          callback(false, data);
        } else {
          Pusher.warn("Couldn't get multiauth info from your webapp", status);
          callback(true, xhr.status);
        }
      }
    };
    var postData = JSON.stringify(authData);
    xhr.send(postData);
  };
  
  /** @private */
  function sortChannels(channels) {
    var sortedChannels = {};
    sortedChannels.requireAuth = [];
    sortedChannels.public = [];
    var channelName;
    for(var i = 0, l = channels.length; i < l; ++i) {
      channelName = channels[i];
      if(channelName.indexOf('private-') === 0 ||
        channelName.indexOf('presence-') === 0 ) {
          
        sortedChannels.requireAuth.push(channelName);
      }
      else {
        sortedChannels.public.push(channelName);
      }
    }
    return sortedChannels;
  };
  
  /** @private */  
  function extend(subClass, baseClass) {
     function inheritance() {}
     inheritance.prototype = baseClass.prototype;

     subClass.prototype = new inheritance();
     subClass.prototype.constructor = subClass;
     subClass.baseConstructor = baseClass;
     subClass.superClass = baseClass.prototype;
  }
  
  module.PusherExt = PusherExt;

})(window)