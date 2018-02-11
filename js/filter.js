
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

function AppViewModel() {
      var self = this;
      self.filter = ko.observable("");
      self.places = ko.observableArray(locations);
      self.filteredItems = ko.computed(function() {
        var filter = this.filter().toLowerCase();
        markerChange(filter);
        if (!filter){
          return this.places();
        }
        else {
              return ko.utils.arrayFilter(this.places(), function(place) {
              //initMap();
              return stringStartsWith(place.title.toLowerCase(), filter);
          });
        }
      },this);
      displayPlaces(self.places);
}

function markerChange(filter)
{
     if (markers)
     {
       console.dir(markers[1]);
     }
    for (var i=0;i<markers.length;i++ )
    {
      marker = markers[i];
      title = marker.title.toLowerCase();
      if (stringStartsWith(title,filter))
      {
        markers[i].setVisible(true);
      }
      else {
        markers[i].setVisible(false);
      }
    }
}

function displayPlaces(places) {
//  console.log(places());
}

var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};
// Activates knockout.js
ko.applyBindings(new AppViewModel());
