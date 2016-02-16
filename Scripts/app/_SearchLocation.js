
function SearchingLocation() {
    var self = this;
    console.log($.cookie("searchCity"));
    console.log($.cookie("searchPP"));
    searchingCity = ko.observable();
    searchingPP = ko.observable();
    searchingCities = ko.observableArray();
    searchingPPs = ko.observableArray();
    self.searchLocationBtn = function () {
        $("#setLocation").modal('hide');
    }
    //searchingCity.subscribe(function () {
        
    //})
    self.loadCities = function () {
        $.ajax({
            url: '/api/Location/GetCities',
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'GET',
            success: function (data) {
                $.each((data), function (i, item) { searchingCities.push(item) });
                searchingCity($.cookie("searchCity"));
                $('#searching-city').selectize({
                    sortField: {
                        field: 'text',
                        direction: 'asc'
                    },
                });
            },
            error: function (jqXHR, status, thrownError) {
                toastr.error("failed to load Cities.Please refresh page and try again", "Error");
            }
        });
    }
    self.loadPopularPlaces = function () {
        searchingPPs.removeAll();
        $.ajax({
            url: '/api/Location/GetPopularPlaces?city=' + searchingCity(),
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'GET',
            success: function (data) {
                $.each((data), function (i, item) { searchingPPs.push(item) });
                searchingPP($.cookie("searchPP"));
                $('#searching-popularPlace').selectize({

                    sortField: {
                        field: 'text',
                        direction: 'asc'
                    },
                });

                //--------------------
               
                
               

                //-----------------
            },
            error: function (jqXHR, status, thrownError) {
                toastr.error("failed to load Famous Places.Please refresh page and try again", "Error");
            }
        });
    }
    self.loadCities();
    var sub = searchingCity.subscribe(function (value) {
        if (!searchingCity()) {
            searchingPP("");
        }
        $.cookie("searchCity", searchingCity(), {path: '/',domain: 'localhost'});
        self.loadPopularPlaces();
    })
    searchingPP.subscribe(function (value) {
        $.cookie("searchPP", searchingPP(), { path: '/',domain: 'localhost' });
    })
}