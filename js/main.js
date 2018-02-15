var map;

// Create a new blank array for all the listing markers.
var markers = [];

var openInfoWindow = null;
// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 5
  });


  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

      // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow,false);
    });

    marker.addListener('mouseover', function(){
      toggleBounce(this)
    });

    marker.addListener('mouseout', function(){
      toggleBounce(this)
    });
    bounds.extend(markers[i].position);
  }

  //document.getElementById('show-listings').addEventListener('click', showListings);
//  document.getElementById('hide-listings').addEventListener('click', hideListings);

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

/* Udacity first Review Change . Marker will bounce one cycle*/
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 750);
    }
  }

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

/* Udacity first Review Change*/
/* Modified the below function to get the information from where the Populate Info Window is getting called. If the function is getting called
 from the link in the left side, then explicitely closing the info window. For that purpose Use the variable "openInfoWindow" to save the last openWindow information.
 */
function populateInfoWindow(marker, infowindow, fromLink) {
  if(openInfoWindow==null)
  {
    openInfoWindow = infowindow;
    //console.log("in if marker")
  }
  else if (fromLink) {
    //console.log("in else marker")
    //openInfoWindow.animation=null;
    openInfoWindow.close();
    openInfoWindow = infowindow;
  }
    // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //infowindow.setContent('<div>' + marker.title + '</div>');
    //console.log(marker.position.lat());
    lat =  marker.position.lat();
    lng = marker.position.lng();
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: false,
        url: 'https://api.foursquare.com/v2/venues/explore?ll=' + lat + ',' + lng + '&limit=1&client_id=0MZXZNASBJLBLHWURYOPYJBTVFYCHOVX1MCUCMAQW3B4KWFY&client_secret=ELHKMQOA0OP2WLZ4GRENW05LCJG2BEIX432C53KK0GUZFSSW&v=20180211',
      //  url: 'https://api.foursquare.com/v2/venues/explore?ll=40.7713024,-73.9632393&limit=1&client_id=0MZXZNASBJLBLHWURYOPYJBTVFYCHOVX1MCUCMAQW3B4KWFY&client_secret=ELHKMQOA0OP2WLZ4GRENW05LCJG2BEIX432C53KK0GUZFSSW&v=20180211',
        success: function(data){
        	var base = data.response.groups[0].items

        	$.each(base, function(index){

        		var url = base[index].venue.url;
        		var llat = base[index].venue.location.lat;
        		var llng = base[index].venue.location.lng;
        		var name = base[index].venue.name;
        		var icon = base[index].venue.categories[0].icon;
            var phone = base[index].venue.contact.phone;
            var address = base[index].venue.location.address;

            var content = '<div><strong>No Info Present</strong></div>';
            if (name)
            { content = '<div><strong>' + name + '</strong></div>';}

            if (address) {content += '<p>' + address + '</p>';}
            //console.dir("phone is" +phone)
            if (phone)
            {content += '<p>' + phone.substring(0,3) +'-' +phone.substring(3,6)+'-' +phone.substring(6,9)+'</p>';}
            if(url)
            { content += '<p>' + url + '</p>'; }
            infowindow.setContent(content);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
          //   infowindow.addListener('closeclick', function() {
          //   infowindow.marker = null;
          // });
          //  console.log(name);
            //console.log(base[index].venue);
        		// var marker = L.marker([llat, llng], {icon: myIcon}).addTo(map);
        		// var content = '<a href="' + url + '" />' + name + '</a>'
        		// marker.bindPopup(content)
        	})
        }
    }).fail(function() {
        // Send alert
        var content = '<div>There was an issue loading the data. Please try again in sometime</div>';
        console.log("foursquare api error");
        infowindow.setContent(content);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        });
    });

    infowindow.open(map, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
      marker.setAnimation(null);
    });
  }
}

/* Udacity first Review Change*/
//  function onClickMarkerPopulateInfo (title)
//  {
//     var largeInfowindow = new google.maps.InfoWindow();
//     var clickTitle = title.toLowerCase();
//   //  console.log(clickTitle);
//   //  console.dir(clickTitle + " " + markers.length);
//      for (var i=0;i<markers.length;i++ )
//      {
//       marker = markers[i];
//       var markerTitle = marker.title.toLowerCase();
//       console.log("markerTitle is "+markerTitle)
//       if (stringStartsWith(markerTitle,clickTitle))
//       {
//         populateInfoWindow(markers[i],largeInfowindow);
//       }
//       else {
//         console.dir("In else");
//         //markers[i].setVisible(false);
//       }
//       //clickTitle="";
//     }
// }

function googleerror()
{
  var mapArea = document.getElementById('map');
  mapArea.style.fontSize ='x-large';
  mapArea.style.paddingLeft='10px';
  mapArea.style.paddingTop='60px';
  mapArea.style.color ='grey';
  console.log(mapArea);
  mapArea.append("Error Loading the Google Maps.");
  console.log("Error loading google API");
}

// //
// window.onerror = function(message, url ,line ){
//   //alert("an error");
//   var mapArea = document.getElementById('map');
//   mapArea.style.fontSize ='50px';
//   mapArea.style.paddingLeft='10px';
//   mapArea.style.paddingTop='60px';
//   mapArea.style.color ='grey';
//   console.log(mapArea);
//   mapArea.append("Error Loading the Google Maps");
//   console.log("Error loading google API");
// //  console.log("error is caught with message = " + message +", url = "+ ", line =" +line);
// }
