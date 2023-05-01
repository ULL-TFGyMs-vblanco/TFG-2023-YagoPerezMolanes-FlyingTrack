self.addEventListener('message', event => {
  console.log("estamos aqui");
  if (event.data === 'get-location') {
    console.log("esta aqui");

    navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
      if (permissionStatus.state === 'granted') {
        // Check if GeolocationSensor is supported by the browser
        if ("GeolocationSensor" in window) {
          // Create a new GeolocationSensor object
          const sensor = new GeolocationSensor({ frequency: 1 });

          // Start the sensor
          sensor.start();

          // Get the sensor's current reading
          sensor.onreading = () => {
            const { latitude, longitude } = sensor.coordinates;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          };

          // Handle errors
          sensor.onerror = error => console.error(`Error: ${error.name}, Message: ${error.message}`);
        } else {
          console.error("GeolocationSensor is not supported by this browser");
        }
        // navigator.geolocation.getCurrentPosition(position => {
        //   console.log(position);
        // });
      } else if (permissionStatus.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log("esta aqui jj");
        }, function(error) {
          reject(error);
        });
      } else {
        reject(new Error('Geolocation permission denied'));
      }
    });

    // if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     event.source.postMessage({
    //       type: 'location',
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude
    //     });
    //   }, error => {
    //     console.log(error);
    //   });
    // } else {
    //   console.log('Geolocation API is not supported.');
    // }
  }
});


