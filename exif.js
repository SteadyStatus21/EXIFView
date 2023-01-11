/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

(function (window, document) {
    'use strict';

    if (!supportsFileReader()) {
        alert('Sorry, your web browser does not support the FileReader API.');
        return;
    }

    window.addEventListener('load', function () {
        document.querySelector('form').addEventListener('submit', handleSubmit, false);
    }, false);

    // >>> IGNORE: Helper code for interactive example.
    document.querySelector('html').setAttribute('data-initialized', '');
    // <<<

    function supportsFileReader() {
        return window.FileReader !== undefined;
    }

    function handleSubmit(event) {
        // >>> IGNORE: Helper code for interactive example.
        window.exifReaderClear();
        // <<<
        event.preventDefault();

        const file = event.target.elements.file.files[0];

        ExifReader.load(file).then(function (tags) {
            // The MakerNote tag can be really large. Remove it to lower
            // memory usage if you're parsing a lot of files and saving the
            // tags.
            delete tags['MakerNote'];
            delete tags['Orientation'];
            delete tags['XResolution'];
            delete tags['YResolution'];
            delete tags['ResolutionUnit'];
            delete tags['Images'];
            delete tags['MPEntry'];
            delete tags['NumberOfImages'];
            delete tags['MPFVersion'];
            delete tags['Rating'];
            delete tags['about'];
            delete tags['InteroperabilityVersion'];
            delete tags['InteroperabilityIndex'];
            delete tags['GPSVersionID'];
            delete tags['CustomRendered'];
            delete tags['CFAPattern'];
            delete tags['Interoperability IFD Pointer'];
            delete tags['CompressedBitsPerPixel'];
            delete tags['ComponentsConfiguration'];
            delete tags['DateTimeDigitized'];
            delete tags['ExifVersion'];
            delete tags['GPS Info IFD Pointer'];
            delete tags['Exif IFD Pointer'];
            delete tags['YCbCrPositioning'];
            delete tags['Color Components'];
            delete tags['Bits Per Sample'];
            delete tags['FileSource'];
            delete tags['SubSecTimeDigitized'];
            delete tags['SubSecTimeOriginal'];
            

            // If you want to extract the thumbnail you can use it like
            // this:
            if (tags['Thumbnail'] && tags['Thumbnail'].image) {
                var image = document.getElementById('thumbnail');
                image.classList.remove('hidden');
                image.src = 'data:image/jpg;base64,' + tags['Thumbnail'].base64;
            }

            // Use the tags now present in `tags`.

            // >>> IGNORE: Helper code for interactive example.
            window.exifReaderListTags(tags);
            // <<<
        }).catch(function (error) {
            // Handle error.

            // >>> IGNORE: Helper code for interactive example.
            window.exifReaderError(error.toString());
            // <<<
        });
    }
})(window, document);
