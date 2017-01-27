/**
 * Created by jbblanc on 26/07/2016.
 */

angular.module('homFi', ['ui.router','toastr','pascalprecht.translate','remoteValidation','ngSanitize', 'ui.bootstrap.dropdown','ng-backstretch','LocalStorageModule','mgcrea.ngStrap', 'angularModalService', 'rzModule','frapontillo.bootstrap-switch','angularFileUpload','xeditable','angularSimplePagination']);

angular.module('homFi').config(['$locationProvider','$stateProvider','$urlRouterProvider','$httpProvider','toastrConfig','$translateProvider','accessLevels', function($locationProvider,$stateProvider,$urlRouterProvider,$httpProvider,toastrConfig,$translateProvider,accessLevels){

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Add interceptors for $httpProvider and $sailsSocketProvider
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('errorInterceptor');

    // Routes that are accessible by anyone
    $stateProvider
        .state('anon', {
            abstract: true,
            template: '<ui-view/>',
            data: {
                access: accessLevels.anon
            }
        })
        .state('anon.login', {
            url: '/login',
            templateUrl: '/views/user/login.html',
            controller: 'loginCtrl'
        })
        .state('anon.register', {
            url: '/register',
            templateUrl: '/views/user/register.html',
            controller: 'registerCtrl'
        })
        .state('anon.forgotPassword', {
            url: '/forgotPassword',
            templateUrl: '/views/user/forgotPassword.html',
            controller: 'forgotPasswordCtrl'
        })
        .state('anon.loading', {
            url: '/loading',
            templateUrl: '/views/loading.html',
            controller: 'loadingCtrl'
        })
    ;

    $stateProvider
        .state('user', {
            abstract: true,
            templateUrl: 'views/common/content.html',
            data: {
                access: accessLevels.user
            }
        })
        .state('user.main', {
            url: '/',
            templateUrl: '/views/main.html',
            controller: 'mainCtrl'
        })
        .state('user.profile', {
            url: '/user/profile',
            templateUrl: '/views/user/profile.html',
            controller : 'profileCtrl'
        })
        .state('user.core', {
            url: '/cores',
            templateUrl: '/views/core/index.html',
            controller : 'coreCtrl'
        })
        .state('user.connections', {
            url: '/connections',
            templateUrl: '/views/connections/index.html',
            controller : 'connectionsCtrl'
        })
        .state('user.rooms', {
            url: '/rooms',
            templateUrl: '/views/rooms/index.html',
            controller : 'roomsCtrl'
        })
        .state('user.device', {
            url: '/devices',
            templateUrl: '/views/devices/index.html',
            controller : 'deviceCtrl'
        })
        .state('user.categories', {
            url: '/categories',
            templateUrl: '/views/categories/index.html',
            controller : 'categoriesCtrl'
        })
        .state('user.panel', {
            url: '/panel',
            templateUrl: '/views/panel/index.html',
            controller : 'panelCtrl'
        })
        .state('user.galleries', {
            url: '/galleries',
            templateUrl: '/views/galleries/index.html',
            controller : 'galleriesCtrl'
        })

    $stateProvider
        .state('admin', {
            abstract: true,
            template: '<ui-view/>',
            //templateUrl: 'views/common/content.html',
            data: {
                access: accessLevels.admin
            }
        })
    ;

    $urlRouterProvider.otherwise('/login');

    $translateProvider.useStaticFilesLoader({prefix: '/languages/',suffix: '.json'});
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.preferredLanguage('en');


    angular.extend(toastrConfig, {
        allowHtml: false,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 1000,
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        progressBar: true,
        tapToDismiss: true,
        timeOut: 4000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });



}]);



angular.module('homFi').run(['$rootScope', '$state', 'auth', 'currentUser','message','editableOptions', function($rootScope, $state, auth, currentUser,message,editableOptions) {
    /**
     * SafeApply function : Ensure that rootscope apply and digest doesn't create conflicts
     *
     * @param   {function}    parent
     */

    editableOptions.theme = 'bs3';

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };



    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (!auth.authorize(toState.data.access)){

            event.preventDefault();
            return $state.go('anon.login');
        }
        else if(toState.name.lastIndexOf('user', 0) === 0){

            if(currentUser.get()===null){
                event.preventDefault();

                $state.go('anon.loading'); // On affiche la page de chargement
            }
        }
    });

}]);
