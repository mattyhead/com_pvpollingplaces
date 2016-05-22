var place = (function(d) {
  'use strict';
  var inner = {},
    outer = {};
  inner.markers = {};
  inner.location = {};
  inner.elements = {};
  inner.markers = { 'building': false, 'entrance': false, 'accessible': false };
  inner.listener = false;
  inner.elements = { 'building': {}, 'entrance': {}, 'accessible': {} };
  inner.images = {
    'building': '/components/com_voterapp/polling.png',
    'entrance': 'components/com_pvpollingplaces/assets/images/e.png',
    'accessible': 'components/com_pvpollingplaces/assets/images/h.png'
  };

  inner.createMarker = function(coords, image, title) {
    var marker = new google.maps.Marker({
      position: coords,
      map: inner.map,
      title: title,
      icon: image
    });
    return marker;
  };

  inner.dropListener = function() {
    google.maps.event.removeListener(inner.listener);
  };

  inner.setElements = function() {
    inner.elements.building.lat = d.getElementById('lat');
    inner.elements.building.lng = d.getElementById('lng');
    inner.elements.entrance.lat = d.getElementById('elat');
    inner.elements.entrance.lng = d.getElementById('elng');
    inner.elements.accessible.lat = d.getElementById('alat');
    inner.elements.accessible.lng = d.getElementById('alng');
  };

  inner.setLocations = function() {
    inner.locationName = d.getElementById('location').value;
    inner.location.building = {
      lat: parseFloat(inner.elements.building.lat.value),
      lng: parseFloat(inner.elements.building.lng.value)
    };
    inner.location.entrance = {
      lat: parseFloat(inner.elements.entrance.lat.value),
      lng: parseFloat(inner.elements.entrance.lng.value)
    };
    inner.location.accessible = {
      lat: parseFloat(inner.elements.accessible.lat.value),
      lng: parseFloat(inner.elements.accessible.lng.value)
    };
  }

  outer.init = function() {
    var script = d.createElement('script');
    script.id = '_gmaps';
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=place.createMap';
    d.body.appendChild(script);

    inner.setElements();
    inner.setLocations();
    for (var marker in d.querySelectorAll("img.marker")) {
      console.log(this.getAttribute('data'));
      marker.addListener('click', function() { inner.addListener(this.getAttribute('data')) });
    }

  };

  outer.createMap = function() {
    inner.map = new google.maps.Map(d.getElementById('map'), {
      center: inner.location.building,
      zoom: 19,
    });
    inner.markers.building = inner.createMarker(inner.location.building, inner.images.building, inner.locationName);
  };

  outer.addListener = function(type) {
    // we only allow one listener at a time
    inner.dropListener();
    inner.listener = google.maps.event.addListener(inner.map, 'click', function(event) {
      //call function to create marker
      if (inner.markers[type] && typeof inner.markers[type].setMap === 'function') {
        inner.markers[type].setMap(null);
        inner.markers[type] = null;
      }
      inner.markers[type] = inner.createMarker(event.latLng, inner.images[type], "Set Me Based On The Click That Activates" + event.latLng);
      inner.elements[type].lat.value = event.latLng.lat();
      inner.elements[type].lng.value = event.latLng.lng();
    });
  };

  return outer;
})(document);
window.addEvent('domready', function() {
  place.init();
});
