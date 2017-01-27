/**
 * Created by jbblanc on 09/01/2016.
 */
'use strict';

angular.module('homFi')
  .service('currentUser', function currentUser(storage) {
    return{
      /**
       * Return  the current user stored in local Storage
       *
       * @returns {{}}
       */
      get: function() {
        return storage.get('auth_token') ? storage.get('auth_token').user : {}
      }
    };
  });
