"use strict"
eventListener('load', initMap, window);

var map;
var bristol = {lat: 51.4500, lng: -2.5833};
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: bristol,
        zoom: 10
    });

    var marker = createMarker(map);
}

function createMarker(map) {
    var marker = new google.maps.Marker({
        position: bristol,
        animation:google.maps.Animation.DROP
    });
    marker.setMap(map);
}
