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
    document.querySelector("input[type='file']").addEventListener("change", function() {
      document.querySelector("input[type='submit']").click();
    });


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
            for (var key in tags) {
              if (key !== 'FNumber' && key !== 'ExposureTime' && key !== 'ISOSpeedRatings' && key !== 'Model' && key !== 'FocalLength' && key != 'ExposureProgram') {
                delete tags[key];
              }
            }
            

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
            var cells = document.getElementsByTagName("td");
            if (Object.keys(tags).length === 0){
              alert("Oh no! The image you uploaded does not have Exposure Time, ISO, or Aperture data!\n\nPlease check the file you uploaded!\n\nThis tool is powerful, but not perfect. If you believe that the file has that information, please email SteadyStatus21 at:\nsteadystatus21@gmail.com");
            }
            var lineBreak = document.createElement("br");
            for (var i = 0; i < cells.length; i++) {
              console.log("Before appending N/A value to table");
                if (cells[i].textContent === "Model") {
                      cells[i].textContent = "Model of Camera:";
                      cells[i].classList.add("model");
                      cells[i+1].classList.add("value");
                      cells[i+1].appendChild(lineBreak);
                }
                if (cells[i].textContent === "ExposureProgram") {
                  cells[i].textContent = "Type of Capturing:";
                  cells[i].classList.add("m-or-a");
                
                  // Check if the child node exists before trying to remove it
                  if (cells[i + 1].firstChild && cells[i + 1].firstChild.textContent === lineBreak.textContent) {
                    cells[i + 1].removeChild(cells[i + 1].firstChild);
                  }
                
                  cells[i + 1].classList.add("value");
                  cells[i + 1].appendChild(lineBreak);
                }

                if (cells[i].textContent === "ExposureTime") {
                    cells[i].textContent = "Exposure Time: ";
                    cells[i].classList.add("exposure-time");
                    cells[i+1].classList.add("value");
                    cells[i+1].appendChild(lineBreak);

                }
                if (cells[i].textContent === "ISOSpeedRatings") {
                    cells[i].textContent = "ISO Speed: ";
                    cells[i].classList.add("iso-speed");
                    cells[i+1].classList.add("value");
                    cells[i+1].appendChild(lineBreak);

                }
                if (cells[i].textContent === "FNumber") {
                    cells[i].textContent = "Aperture: ";
                    cells[i].classList.add("aperture");
                    cells[i+1].classList.add("value");
                    cells[i+1].appendChild(lineBreak);
                }
                if (cells[i].textContent === "FocalLength") {
                    cells[i].textContent = "Focal Length:";
                    cells[i].classList.add("focal-length");
                    cells[i+1].classList.add("value");
                    cells[i+1].appendChild(lineBreak);
                }
            }
            const exifTableBody = document.getElementById("exif-table-body");
            const mOrAElement = exifTableBody.querySelector(".m-or-a");
            
            if (mOrAElement) {
                exifTableBody.insertBefore(mOrAElement.parentNode, exifTableBody.firstChild);
            }
            // <<<
        }).catch(function (error) {
            // Handle error.

            // >>> IGNORE: Helper code for interactive example.
            window.exifReaderError(error.toString());
            // <<<
        });
    }
})(window, document);


