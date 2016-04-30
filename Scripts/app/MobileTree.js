﻿function Model(data) {
    var self = this;
    data = data || {};
    self.modelName = data.model;
}
function Company(data) {
    var self = this;
    data = data || {};
    self.companyName = data.companyName;
    self.showModels = ko.observableArray();
    if (data.models) {
        var models = $.map(data.models, function (item) { return new Model(item) });
        self.showModels(models);
    }
}
var availableBrands = ko.observableArray();
var selectedBrand = ko.observable();
var selectedModel = ko.observable();
var sub = selectedBrand.subscribe(function (value) {
    RefreshSearch();
    loadModels();
})
loadBrands = function () {
    $.ajax({
        url: '/api/Electronic/GetBrands',
        dataType: "json",
        contentType: "application/json",
        cache: false,
        type: 'GET',
        success: function (data) {
            $.each((data), function (i, item) { availableBrands.push(item) });
            $('#select-brand').selectize();
        },
        error: function (jqXHR, status, thrownError) {
            toastr.error("failed to load Brands.Please refresh page and try again", "Error");
        }
    });
}
var availableModels = ko.observableArray();
var selectedModel = ko.observable();
var loadModels = function () {
    availableModels.removeAll();
    $.ajax({
        url: '/api/Electronic/GetModels?brand=' + selectedBrand(),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        type: 'GET',
        success: function (data) {
            $.each((data), function (i, item) { availableModels.push(item) });
            $('#select-model').selectize();
        },
        error: function (jqXHR, status, thrownError) {
            toastr.error("failed to load Models.Please refresh page and try again", "Error");
        }
    });
}



var mobileAccessories = ko.observable(false);
var brand = ko.observable("");
var model = ko.observable("");
var title = ko.observable($("#search").val());
var tags = ko.observable("");
var minPrice = ko.observable(0);
var maxPrice = ko.observable(50000);
selectedModel.subscribe(function () {
    RefreshSearch();
})
mobileAccessories.subscribe(function () {
    RefreshSearch();
})
minPrice.subscribe(function () {
    RefreshSearch();
});
maxPrice.subscribe(function () {
    RefreshSearch();
});
tags.subscribe(function () {
    RefreshSearch();
})

function TreeViewModel() {
    var self = this;
    loadBrands();
    self.showAds = ko.observableArray();
    self.isLoading = ko.observable(false);
    searchingCity.subscribe(function () {
        RefreshSearch();
    })
    searchingPP.subscribe(function () {
        RefreshSearch();
    })
    self.showCompanies = ko.observableArray();
    self.loadTree = function () {
        $.ajax({
            url: '/api/Electronic/GetMobileTree',
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'POST',
            success: function (data) {
                var dat = $.map(data, function (item) { return new Company(item) });
                self.showCompanies(dat);
                $("#navigation").jstree({
                    "themes": {
                        "theme": "classic"
                    },
                    "core": {
                        "themes": {
                            "icons": false
                        }
                    },
                    "plugins": ["search"]
                }).on('changed.jstree', function (e, data) {
                    brand( data.instance.get_node(data.node.parent).text);
                    model(data.instance.get_node(data.selected[0]).text);
                   
                    if (brand() == undefined) {
                        brand(model());
                        model("");
                    }
                    RefreshSearch();
                })
  .jstree();
                var to = false;
                $('#treeSearch').keyup(function () {
                    if (to) { clearTimeout(to); }
                    to = setTimeout(function () {
                        var v = $('#treeSearch').val();
                        $('#navigation').jstree(true).search(v);
                    }, 250);
                });
            },
            error: function (jqXHR, status, thrownError) {
                toastr.error("failed to laod category tree. Please refresh page", "Error");
            }
        });
    }
    //self.loadTree();
    
}


function RefreshSearch() {
    self.isLoading(true);
    console.log(selectedBrand());
    $.ajax({
        url: '/api/Electronic/SearchMobileAds?brand=' + selectedBrand() + '&model=' + selectedModel() + '&tags=' + tags() + '&title=' + title() + '&minPrice=' + minPrice() + '&maxPrice=' + maxPrice() + '&city=' + searchingCity() + '&pp=' + searchingPP() + '&isAccessories=' + mobileAccessories(),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        type: 'POST',
        success: function (data) {
            self.isLoading(false);
            var mappedads = $.map(data, function (item) { return new Ad(item); });
            $("#FirstLoading").css("display", "block");
            self.showAds(mappedads);
        },
        error: function () {
            self.isLoading(false);
            toastr.error("failed to search. Please refresh page and try again", "Error!");
        }
    });
}

var saveResult = function (data) {
    minPrice ( data.fromNumber );
    maxPrice  (data.toNumber);
};
$("#ionrange_1").ionRangeSlider({
    min: 0,
    max: 50000,
    type: 'double',
    prefix: "Rs",
    maxPostfix: "+",
    prettify: false,
    hasGrid: true,
    from: minPrice,
    to: maxPrice,
    onFinish: saveResult
});