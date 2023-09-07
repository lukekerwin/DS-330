let map;

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 14.2,
    center: { lat: 40.796481, lng: -77.8654161 },
    mapId: "DEMO_MAP_ID",
  });

  const markers = await fetch("./markers.json").then((res) => res.json());
    markers.forEach((marker) => {
        const content = `
        <div class="infowindow">
            <h3>${marker.Location}</h3>
            <p>${marker.Offenses}</p>
            <p>${marker.Date}</p>
        </div>
        `;
        const markerElement = new AdvancedMarkerElement({
            map: map,
            position: { lat: marker.lat, lng: marker.lng },
            title: marker.Location,
        });
        markerElement.addEventListener("gmp-click", () => {
            const infowindow = new google.maps.InfoWindow({
                content: content,
            });
            infowindow.open(map, markerElement);
        });
    });
}
initMap();