window.addEventListener('load', initMap);

var map;
var bristol = {lat: 51.4500, lng: -2.5833};
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: bristol,
        zoom: 10
    });

    var marker = new google.maps.Marker({
        position: bristol
    });
    marker.setMap(map);
}