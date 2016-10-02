(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', foundItems)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json");

  function foundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        myTitle: '@title',
        myErro: '@erro',
        onRemove: '&'
      },
      controller: EmptyListDirectiveController,
      controllerAs: 'itemmenu',
      bindToController: true
    };

    return ddo;
  }

  function EmptyListDirectiveController() {
    var itemmenu = this;
    itemmenu.erro = "";
    itemmenu.emptyInList = function () {
      if (itemmenu.items.length > 0) {
        return true;
      }
    }
    return false;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var itemmenu = this;
    itemmenu.searchTerm = "";
    itemmenu.found = [];
    itemmenu.erro = "";

    itemmenu.setSearchTerm = function () {
      //  itemmenu.searchTerm = itemmenu.searchTerm;
      var promise = MenuSearchService.getMatchedMenuItems(itemmenu.searchTerm);
      promise.then(function (foundItems) {
        itemmenu.found = foundItems;
        itemmenu.title = origTitle + " (" + itemmenu.found.length + " items )";
        itemmenu.erro = "NOTHING FOUND!";
      })
    }

    var origTitle = "Narrow Down Menu Choice #1";

    itemmenu.title = origTitle + " (" + itemmenu.found.length + " items )";

    itemmenu.removeItem = function (itemIndex) {
      itemmenu.found.splice(itemIndex, 1);
      itemmenu.title = origTitle + " (" + itemmenu.found.length + " items )";
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (shearchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath)
      }).then(function (result) {
        // process result and only keep items that match
        var foundItems = [];
        if(shearchTerm.length == 0){
          return foundItems;
        }else{
          var it,ct;
          for(it in result.data){ //scan resulta.data objects
            for(ct in it){  //scan object proprerties
              if(result.data[it][ct].description.indexOf(shearchTerm) > -1){
                var name = result.data[it][ct].name;
                var shortName = result.data[it][ct].short_name;
                var description = result.data[it][ct].description;
                var item = {
                  name : name,
                  short_name : shortName,
                  description : description
                };
                foundItems.push(item);
              }
            }
          }
        }
        // return processed items  
        return foundItems;
      })
    }
  }

})();
