self.addEventListener('message', event => {
  console.log("estamos aqui");
  if (event.data === 'get-location') {
    console.log("esta aqui");
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(position => {
        event.source.postMessage({
          type: 'location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, error => {
        console.log(error);
      });
    } else {
      console.log('Geolocation API is not supported.');
    }
  }
});
