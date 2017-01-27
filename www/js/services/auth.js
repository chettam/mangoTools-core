'use strict';

/**
 * @ngdoc service
 * @name agroDriveApp.auth
 * @description
 * # auth
 * Service in the agroDriveApp.
 */
angular.module('homFi')
  .service('auth', [ '$http','$rootScope', '$state', 'storage', 'accessLevels', 'backEnd','rest','currentUser','message', function($http,$rootScope, $state, storage, accessLevels, backEnd,rest,currentUser,message) {

    $rootScope.$on('Auth',function(){
      if(!_.isEmpty(currentUser.get()) && currentUser.get().hasOwnProperty('firstName') ){
        message.success('Login','Welcome : '+ currentUser.get().firstName+' !')
      } else {
        message.success('Logout','Successfully disconnected')
      }
    });
    
    return{
      /**
       * Method to authorize current user with given access level in application.
       *
       * @param   {Number}    access  Access level to check
       *
       * @returns {*}
       */
      authorize: function(access) {
        if (access === accessLevels.user) {
          return this.isAuthenticated();
        } else {
          return true;
        }
      },

      /**
       * Method to check if current user is authenticated or not. This will just
       * simply call 'Storage' service 'get' method and returns it results.
       *
       * @returns {*}
       */
      isAuthenticated: function() {
        return storage.get('auth_token');
      },

      /**
       * Method make login request to backend server. Successfully response from
       * server contains user data and JWT token as in JSON object. After successful
       * authentication method will store user data and JWT token to local storage
       * where those can be used.
       *
       * @param   {*} credentials
       *
       * @returns {*|Promise}
       */
      login: function(credentials) {
        return $http
          .post(backEnd.url + '/api/user/login', credentials, {withCredentials: false})
          .success(function(response) {
            storage.set('auth_token',response);
            $rootScope.$broadcast('Auth');
          });
      },

      register: function(user) {
        return $http
          .post(backEnd.url + '/api/user', user, {withCredentials: false})
          .success(function(response) {
            storage.set('auth_token', response);
            $rootScope.$broadcast('Auth');
          });
      },

      /**
       * The backend doesn't care about logouts, delete the token and you're good to go.
       *
       * Should we still make logout process to backend side?
       */
      logout: function() {
        storage.unset('auth_token');
        $rootScope.$broadcast('Auth');
        $state.go('anon.login');
      }
    };
  }]);
