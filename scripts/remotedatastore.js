(function (window){
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;

  function RemoteDataStore(url){
    if(!url){
      throw new Error('No remote URL supplied');
    }
    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function(key,val){
    $.ajax(this.serverUrl,{
      type:'POST',
      contentType: 'application/json',
      data: JSON.stringify({emailInput : key, coffeeOrder : val.coffee}),
      success: function(){
        //left blank because it works somehow
        //a to do is basically unneccessary
      },
      error: function(serverResponse){
        console.log(serverResponse.responseText);
      }
    });
  };

  RemoteDataStore.prototype.getAll = function(cb){
    $.get(this.serverUrl, function(serverResponse){
      console.log(serverResponse);
      cb(serverResponse);
    });
  };
  RemoteDataStore.prototype.get = function(key){
    $.ajax(this.serverUrl,{
      type: 'GET',
      data: JSON.stringify({emailInput:key}),
      success: function(response){
        //return the first JSON object with that email
        return response.responseJSON[0];
      },
      error: function(serverResponse){
        console.log(serverResponse.responseText);
      }
    });
  };

  RemoteDataStore.prototype.remove = function(key){
    //save URL so it doesnt fall out of scope
    var url = this.serverUrl;
    var response = $.ajax(this.serverUrl,{
      type: 'GET',
      data: JSON.stringify({emailInput:key}),
      success: function(){
        //Gets first response just in case
        //there is more than one JSON object in the responseText
        var id = response.responseJSON[0].id;
        $.ajax(url+'/'+id,{
          type: 'DELETE',
          error: function(serverResponse){
            console.log(serverResponse.responseText);
          }
        });
      },
      error: function(serverResponse){
        console.log(serverResponse.responseText);
      }
    });
  };

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
