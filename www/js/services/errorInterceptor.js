/**
 * Created by jbblanc on 06/01/2016.
 */
'use strict';

/**
 * @ngdoc service
 * @name agroDriveApp.errorInterceptor
 * @description
 * # errorInterceptor
 * Service in the agroDriveApp.
 */
angular.module('homFi')
    .service('errorInterceptor', function errorInterceptor($q, message) {
        return {
            /**
            * Interceptor method which is triggered whenever response occurs on $http queries. Note
            * that this has some sails.js specified hack for errors that returns HTTP 200 status.
            *
            * This is maybe sails.js bug, but I'm not sure of that.
            *
            * @param   {*} response
            *
            * @returns {Promise}
            */
            response: function(response) {
               if (response.status && response.status !== 200) {
                   return $q.reject(response);
               } else {
                   return response || $q.when(response);
               }
            },
            
            /**
            * Interceptor method that is triggered whenever response error occurs on $http requests.
            *
            * @param   {*} response
            *
            * @returns {Promise}
            */
            responseError: function(response) {
               var errorMessage = '';

                if (response.data){
                    if (response.data.error) {
                        errorMessage = response.data.error;
                    } else if (response.data.message) {
                        errorMessage = response.data.message;
                    } else if (response.data) {
                        errorMessage = response.data;
                    } else {
                        errorMessage = response.statusText;
                    }
                    if (errorMessage) {
                        message.error(errorMessage);
                    }

                    return $q.reject(response);
                }
              
            }
        };
    });
