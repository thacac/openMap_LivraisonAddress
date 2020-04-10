
/*****************/
/**  SETTINGS    */
/*****************/
var mapDiv = "maCarte"; //setup div id that will display the map
var day = (new Date()).getDay();//day linked to the delivery zone to be displayed- by deafault TODAY
//zones list defintion
let myZonesGeo = {
    liste: [
        {
            jWeek: 5, //day of the week
            name: "Blagnac",
            hr_deb: "11",  //time slot for delivery start
            hr_fin: "14:30",  //time slot for delivery end
            url: "./json/secteur_grenade.geojson"  //url to geojson polygon file defning the area
        },
        {
            jWeek: 1, //day of the week
            name: "Blagnac",
            hr_deb: "11",  //time slot for delivery start
            hr_fin: "14:30",  //time slot for delivery end
            url: "./json/secteur_colomiers.geojson"  //url to geojson polygon file defning the area
        },
    ]
}
/*****************/
/* END SETTINGS  */
/*****************/

let carte, marker, pos; //init global var for map, marker and its position
let zones = [];//decoded geojson zones to be injected in map

window.onload = () => {

    //map initialisation on load
    carte = L.map(mapDiv).setView([43.6045, 1.4313], 13); //define default map options (geo on center, zoom factor)
    // carte.addEventListener('click',()=>{alert('no')})
    mapInit() //apply default layout and other custo basic fonctions
}

/***
 * map loading
 */
mapInit = () => {
    //loading des tuiles
    L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 10,
        maxZoom: 18
    }).addTo(carte);


    for (zone in myZonesGeo.liste) {
        if (myZonesGeo.liste[zone].jWeek == day) {
            callZone(myZonesGeo.liste[zone].url)
        }
    }
}

/**
 * Add marker on map
 * @param {*} pos 
 */
addMarker = (pos) => {
    //customize pin
    let options = {
        icone: L.icon({
            iconUrl: "./img/mapPointer.png",
            iconSize: [50, 74],
            iconAnchor: [25, 74],
            popupAnchor: [0, -74]
        }),
        draggable: true
    }

    console.log('marker' + marker)
    if (marker != undefined) {
        carte.removeLayer(marker);//if marker exist remove it
    }

    marker = L.marker(pos, { icon: options.icone, draggable: options.draggable }).addTo(carte) //apply marker to pos, make it draggable

    //apply marker to pos, make it draggable

    // //drag position update
    // marker.on('dragend', (e) => {
    //     pos = e.target.getLatLng()
    //     console.log('Dragpos=' + pos)
    //     getAddress()
    // })
    // console.log('last=' + pos)

    //center the map on pin
    carte.setView(pos, 17);
    
}

//delivery area display
callZone = (zone) => {

    // On initialise la requête Ajax
    let xmlhttp = new XMLHttpRequest();
    // Sur changement de statut
    xmlhttp.onreadystatechange = () => {
        // Si la transaction est terminée
        if (xmlhttp.readyState == 4) {
            // Si la transaction est un succès
            if (xmlhttp.status == 200) {
                // On traite le json reçu
                let geojson = JSON.parse(xmlhttp.responseText)
                // console.log(geojson)
                // On dessine le polygone
                let geojsonLayer = L.geoJSON(geojson, {
                    style: {
                        "color": "#011d4a",
                        "opacity": 1,
                        "weight": 3,
                        "fillColor": "#0565ff",
                        "fillOpacity": 0.4
                    }
                });

                //addZone to the map
                geojsonLayer.addTo(carte);
                carte.fitBounds(geojsonLayer.getBounds())
                //event listener for click on the area
                geojsonLayer.on('click', getAddress);

            } else {
                console.log(xmlhttp.status);
            }
        }
    }

    // On ouvre la connexion vers le fichier geojson
    console.log('zone' + zone)
    xmlhttp.open('GET', zone, true);
    // On envoie la requête
    xmlhttp.send(null)
}

/**
 * Call to the api for searching the address based on lat/lng
 */
getAddress = (e, type) => {

    if (e !== undefined) {
        pos = e.latlng
    }

    console.log('pos=' + pos)

    //Init Ajax
    const xmlhttp = new XMLHttpRequest

    //Query state change listener
    xmlhttp.onreadystatechange = () => {
        //if query done
        console.log(xmlhttp)
        if (xmlhttp.readyState == 4) {
            // id reply ok
            if (xmlhttp.status == 200) {

                //setup related marker pin on the map
                addMarker(pos);
                //gt reply
                let response = JSON.parse(xmlhttp.response)
                //gat needed data
                console.log(response)

                //send data to form
                document.querySelector("#ville").value = response.address.village;
                document.querySelector("#cp").value = response.address.postcode;
                document.querySelector("#adresse").value = `${response.display_name}`;//${response.address.house_number} ${response.address.road}
            }
        }
    }
    //open request
    xmlhttp.open('get', `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`)

    //send request
    xmlhttp.send();
}