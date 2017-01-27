'use strict';

/**
 * @ngdoc service
 * @name homFi.message
 * @description
 * # message
 * Service in the homFi.
 */
angular.module('homFi')
  .service('message',['toastr',function(toastr) {
    return {
      success : function(title,message){
        toastr.success(title,message);
      },
      info : function(title,message){
        toastr.info(title,message)
      },
      warning : function(title,message){
        toastr.warning(title,message)

      },
      error : function(title,message){
        toastr.error(title,message)
      }
    }
  }]);
