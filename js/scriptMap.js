let carte = L.map('maCarte').setView([43.6045, 1.4313], 13);

window.onload = () => {
    
   //loading des tuiles
    L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(carte);

    //personnalisation du marqueur
    var icone = L.icon({
        iconUrl:"../img/mapPointer.png",
        iconSize: [50,74],
        iconAnchor: [25, 74],
        popupAnchor: [0, -74]
    })

    callZone();
    // var poi = L.marker([51.5, -0.09],{icon: icone}).addTo(carte);
    // poi.bindPopup("<h1>Hello!</h1>")
}

callZone=()=>{
let xmlhttp = new XMLHttpRequest();
console.log('toto')
// Sur changement de statut
xmlhttp.onreadystatechange = () => {
    // Si la transaction est terminée
    if (xmlhttp.readyState == 4){
        // Si la transaction est un succès
        if(xmlhttp.status == 200) {
            // On traite le json reçu
            let geojson = JSON.parse(xmlhttp.responseText)
            console.log(geojson)
            // On dessine le polygone
            let geojsonLayer = L.geoJSON(geojson, {
                style: {
                    "color": "#839c49",
                    "opacity": 1,
                    "weight": 1,
                    "fillColor": "#999999",
                    "fillOpacity": 0.8
                }
            });
            // On ajoute une popup
            geojsonLayer.bindPopup("Coucou pinou");

            // On ajoute à la carte
            geojsonLayer.addTo(carte);

        } else {
            console.log(req.status);
        }
    }
}

// On ouvre la connexion vers le fichier geojson
xmlhttp.open('GET', '../json/secteur_blagnac.geojson', true);
// On envoie la requête
xmlhttp.send(null)
}

reqMapAddress=()=>{

}