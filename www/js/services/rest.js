'use strict';

/**
 * @ngdoc service
 * @name agroDriveApp.rest
 * @description
 * # rest
 * Service in the agroDriveApp.
 */
angular.module('homFi')
  .service('rest', [ '$http','$log','storage','backEnd','$rootScope','$state',function($http,$log,storage,backEnd,$rootScope,$state) {


    /**
     * The backend doesn't care about logouts, delete the token and you're good to go.
     *
     * Should we still make logout process to backend side?
     */
    function logout() {
      storage.unset('auth_token');
      $rootScope.$broadcast('Auth');
      $state.go('anon.login');
    }

    function endpoint(path){
      return backEnd.url+path
    }


    return{

      /**
       * Create function : send create request for a end point (model) to the back end via sockets
       *
       * @param   {string}    endPoint
       * @param   {{}}        data
       *
       * @returns {{}}
       */

      create: function (endPoint, data, success) {
        $http({
          method: 'POST',
          url:  endpoint(endPoint),
          data : data
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * CreateorUpdate function : send create request for a end point (model) to the back end via sockets
       *
       * @param   {string}    endPoint
       * @param   {{}}        data
       *
       * @returns {{}}
       */

      createOrUpdate: function (endPoint, data, success) {
        $http({
          method: 'POST',
          url:  endpoint(endPoint +'/createUpdate'),
          data : data
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * Count function : return the number of object for a particular quesry and endpoint (model)
       *
       * @param   {string}    endPoint
       * @param   {{}}        parameters
       *
       * @returns {{}}
       */

      count: function (endPoint, parameters, success) {
        parameters = parameters || {};
        $http({
          method: 'GET',
          url:  endpoint(endPoint + '/count/'),
          params : parameters
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * Update function : send update request for a end point (model) to the back end via sockets
       *
       * @param   {string}    endPoint
       * @param   {{}}        data
       *
       * @returns {{}}
       */


      update: function (endPoint, data, success) {
        $http({
          method: 'POST',
          url:  endpoint(endPoint + '/' + data._id),
          data : data
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * Delete function : send delete request for a end point (model) to the back end via sockets
       *
       * @param   {string}    endPoint
       * @param   {{}}        data
       *
       * @returns {{}}
       */
      delete: function (endPoint, data, success) {
        $http({
          method: 'DELETE',
          url:  endpoint(endPoint + '/' + data._id),
          params : data
        }).then(function successCallback(reponse) {
          success(reponse);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * List function : send list request for a end point (model) to the back end via sockets for a certain query
       *
       * @param   {string}    endPoint
       * @param   {{}}        parameters
       * @function success
       *
       * @returns {[]}
       */
      list: function (endPoint, parameters, success) {
        $http({
          method: 'GET',
          url:  endpoint(endPoint)
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * send an http get to specific end point
       * @param endPoint
       * @param success
       */
      get :function(endPoint,success){
        $http({
          method: 'GET',
          url:  endpoint(endPoint)
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      },
      /**
       * List function : send list request for a end point (model) to the back end via sockets for a certain query
       *
       * @param   {string}    endPoint
       * @param   {{}}        parameters
       * @function success
       *
       * @returns {[]}
       */
      getOne: function (endPoint, parameters, success) {
        parameters = parameters || {};
        $http({
          method: 'GET',
          url:  endpoint(endPoint + parameters.id)
        }).then(function successCallback(response) {
          success(response.data);
        }, function errorCallback(response,status) {
          if(response.status === 403) return logout(response);
          $log.error(response)
        });
      }
    };
  }]);
