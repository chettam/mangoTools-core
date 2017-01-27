'use strict';

angular.module('homFi')
  .service('authInterceptor', function authInterceptor($q, $injector, storage) {
    return {
      /**
       * Interceptor method for $http requests. Main purpose of this method is to add JWT token
       * to every request that application does.
       *
       * @param   {*} config
       *
       * @returns {*}
       */
      request: function(config) {
        var token;
        // var apiKey;
        // if(storage.get('apiKey')){
        //   apiKey = storage.get('apiKey');
        // }

        if (storage.get('auth_token')) {
          token = angular.fromJson(storage.get('auth_token')).token;
        }

        // Yeah we have a token
        if (token) {
          if (!config.data) {
            config.data = {};
          }

          /**
           * Set token to actual data and headers. Note that we need bot ways because of
           * socket cannot modify headers anyway. These values are cleaned up in backend
           * side policy (middleware).
           */
          config.data.token = token;
          config.headers.Authorization = 'Bearer ' + token;
        }
        
        // if(apiKey){
        //   config.headers.apiKey = apiKey;
        // }

        return config;
      },

      /**
       * Interceptor method that is triggered whenever response error occurs on $http requests.
       *
       * @param   {*} response
       *
       * @returns {Promise}
       */
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          storage.unset('auth_token');

          $injector.get('$state').go('anon.login');
        }

        return $q.reject(response);
      }
    };
  });/**
 * Created by jbblanc on 09/07/2016.
 */
