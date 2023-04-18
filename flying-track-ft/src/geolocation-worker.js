// Este service worker escucha mensajes, y si recibe un mensaje con el
// contenido 'getLocation', usa el metodo de geolocalizacion para obtener
// posicion actual. Posteriormente el service worker envia un mensaje de vuelta
// al cliente con la localizacion del usuario, o un error si la geolocalizacion
// no esta soportada por el dispositivo o hubo algun problema al calcularla

self.addEventListener('message', (event) => {
  if (event.data === 'getLocation') {
    if (!navigator || !navigator.geolocation) {
      self.postMessage({ error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => self.postMessage({ location: position }),
      error => self.postMessage({ error })
    );
  }
});
