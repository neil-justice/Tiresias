"use strict"

var map;
var location;

function initMap(latlng) {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: latlng,
        zoom: 10
    });

    return map;
}

function createMarker(map, location) {
    var marker = new google.maps.Marker({
        position:location,
        animation:google.maps.Animation.DROP
    });
    marker.setMap(map);
}

function setLocation (lat, lng) {
    location = {lat: lat, lng: lng};
    var marker = createMarker(map, location);
}