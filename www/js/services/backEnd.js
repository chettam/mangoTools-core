/**
 * Created by jbblanc on 09/01/2016.
 */

angular.module('homFi').service('backEnd',[ '$location',function ($location) {
    return  {
      url : 'http://localhost:1410'
    }
  }]);
