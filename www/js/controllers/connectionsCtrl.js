/**
 * Created by jbblanc on 26/07/2016.
 */
angular.module('homFi')
    .controller('connectionsCtrl',[ '$rootScope','$scope','message','currentUser','rest', function ($rootScope,$scope,message,currentUser,rest) {


        $scope.connection ={};
        $scope.connections =[];
        
        rest.get('/api/auth/cnx',function(connections){
            $scope.connections = connections
        });

        rest.get('/api/auth/service/available',function(services) {
            $scope.availableServices = services;
        });
        
        $scope.createConnection = function(isValid){
            if(isValid){
                rest.create('/api/auth/cnx',$scope.connection,function(connection){
                    rest.get('/api/auth/cnx',function(connections){
                        $scope.connections = connections
                    });
                })
            }
        };
        $scope.authenticateConnection = function(connection){
            rest.create('/api/auth/cnx/auth',connection,function(result){
                _.forEach($scope.connections,function(cnx){
                    if(cnx.id === result.id){
                        cnx = result;
                    }
                });
            })
        };


        

        $scope.toggleConnection = function(connection){
            rest.update('/api/auth/cnx',connection,function(){
               
            });
        };

        $scope.deleteConnection = function(connection){
            rest.delete('/api/auth/cnx',connection,function(){
                rest.get('/api/auth/cnx',function(connections){
                    $scope.connections = connections
                });
            });
        };
    }]);
