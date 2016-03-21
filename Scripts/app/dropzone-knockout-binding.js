﻿ko.bindingHandlers.dropzone = {
    init: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());

        var options = {
            maxFileSize: 15,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 30,
            addRemoveLinks: false,
            acceptedFiles: ".jpeg,.jpg,.png,.gif",
            init: function () {
                var myDropzone = this;
                fileList = [];
                i = 1;
                this.on("success", function (file, serverFileName) {

                    console.log(serverFileName);
                    var abc = $.map(serverFileName, function (item) { return (item); });
                    $.each(abc, function (index, value) {
                        fileList[i] = { "fileName": value, "fileId": i++ };
                    })
                    console.log(fileList);
                });
            }
        };

        $.extend(options, value);

        $(element).addClass('dropzone');
        new Dropzone(element, options);
    }
};
$(function () {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (w < 786) {
        $("#dropzonePreview").removeClass("dz-message");
    }
});
