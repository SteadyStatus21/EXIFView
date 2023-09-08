document.addEventListener('DOMContentLoaded', function () {
    const viewer = new Viewer(document.getElementById('previewImage'), {
        inline: false, // Open the viewer in a modal dialog
		toolbar: 0,
		navbar: 0,
		title: "Image Preview - Enlarged",
        viewed() {
            // viewer.zoomTo(1); // Set the default zoom level
        },
    });

    document.getElementById('fileInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            const img = document.getElementById('previewImage');
            img.src = reader.result;

            EXIF.getData(file, function () {
				const cameraModel = EXIF.getTag(this, 'Model');
				const cameraModelElement = document.getElementById('cameraModel');
				
				function decimalToFraction(decimal){
					decimal = decimal.toString()
					let front;
					let zeros = (decimal.length - decimal.indexOf('.'))-1;
					let decimalDenom = Number(1+''.padEnd(zeros, 0));
					let divider= [];

					if(!decimal.includes('.')) return 'not a decimal';
					if (decimal.indexOf('.') != 1
						&& Number(decimal.charAt(0))!=0) {
						front = decimal.substring(0, decimal.indexOf('.'));
					}
					if(Number(front)===0 && front.includes('-')) front = '-';

					decimal = Number(decimal.substring(decimal.indexOf('.')+1))
					for (var i = 0; i < 1000; i++) {
						if (!(decimal%i || decimalDenom%i)) {
							divider.push(i);
						}
					}

					divider=divider[divider.length-1];
					decimal=(decimal/divider);
					decimalDenom=(decimalDenom/divider);

					if (front && front !== '-') {
						return `${front}+(${decimal}/${decimalDenom})`;
					}else if (front && front === '-'){
						return `${front}(${decimal}/${decimalDenom})`;
					}else{
						return `${decimal}/${decimalDenom}`;
					}
				}
				
				if (cameraModel) {
					cameraModelElement.textContent = cameraModel;
					const googleSearchLink = `https://www.google.com/search?q=${encodeURIComponent(cameraModel)}`;
					const cameraModelLink = document.createElement('a');
					cameraModelLink.href = googleSearchLink;
					cameraModelLink.target = '_blank';
					cameraModelLink.textContent = cameraModel;
					cameraModelElement.innerHTML = '';
					cameraModelElement.appendChild(cameraModelLink);
                } else {
                    cameraModelElement.textContent = 'N/A'; // Handle the case when camera model is not available
				}
				// Get the ExposureTime value
				var exposureTime = EXIF.getTag(this, 'ExposureTime');

				// Check if the ExposureTime has a denominator property and if the numerator is not zero
				if (exposureTime.denominator !== undefined && exposureTime.numerator !== 0) {
				  // Calculate the simplified numerator and denominator
				  var gcd = function(a, b) {
					return b ? gcd(b, a % b) : a;
				  };
				  var commonDivisor = gcd(exposureTime.numerator, exposureTime.denominator);
				  var simplifiedNumerator = exposureTime.numerator / commonDivisor;
				  var simplifiedDenominator = exposureTime.denominator / commonDivisor;

				  // Create the text item in the "x/x" format
				  var textItem = simplifiedNumerator + '/' + simplifiedDenominator;

				  // Set the text item as a variable
				  var result = textItem;

				  // Log the result to the console
				  console.log(result);
				} else {
				  console.log('No valid numerator or denominator found in ExposureTime.');
				}
				var apertureVal = 'f/' + EXIF.getTag(this, 'FNumber');
				
				var gpsLatitude = EXIF.getTag(this, 'GPSLatitude');
				var gpsLongitude = EXIF.getTag(this, 'GPSLongitude');

				if (gpsLatitude && gpsLongitude) {
				  // Convert the GPS coordinates to a human-readable format
				  var latitude = gpsLatitude[0] + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600;
				  var longitude = gpsLongitude[0] + gpsLongitude[1] / 60 + gpsLongitude[2] / 3600;

				  // Check for the North/South and East/West indicators and append them
				  latitude += (gpsLatitude[3] === 'S' ? ' S' : ' N');
				  longitude += (gpsLongitude[3] === 'W' ? ' W' : ' E');

				  var gpsCoordinates = latitude + ', ' + longitude;
				} else {
				  var gpsCoordinates = 'No GPS Coordinates Found!';
				}

				console.log(gpsCoordinates);

                document.getElementById('cameraModel').textContent = EXIF.getTag(this, 'Model');
                document.getElementById('iso').textContent = EXIF.getTag(this, 'ISOSpeedRatings');
                document.getElementById('shutterSpeed').textContent = result;
                document.getElementById('aperture').textContent = apertureVal;
                document.getElementById('mode').textContent = EXIF.getTag(this, 'ExposureProgram');
                document.getElementById('dateTime').textContent = EXIF.getTag(this, 'DateTimeOriginal');
				document.getElementById('flashfired').textContent = EXIF.getTag(this, 'Flash');
				document.getElementById('gps').textContent = gpsCoordinates;
				document.getElementById('camerasensor').textContent = EXIF.getTag(this, 'SensingMethod');
				console.log(EXIF.getTag(this, 'SensingMethod'));

                // Show the image preview and metadata once data is available
                document.getElementById('previewImage').style.display = 'block';
            });
        };

        reader.readAsDataURL(file);
    });
});
