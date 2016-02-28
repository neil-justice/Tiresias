window.addEventListener('load', initMap);

var map;
function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: {lat: 51.4500, lng: -2.5833},
        zoom: 10
    });
}