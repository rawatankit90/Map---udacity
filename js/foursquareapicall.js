$.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: 'https://api.foursquare.com/v2/venues/explore?ll=' + latlng.lat + ',' + latlng.lng + '&limit=1&client_id=3ODULPRCZOZL43JVOBNUBAUPXD5MXKBX24DOUZYNO0V3SEUL&client_secret=MBM0IB0YS1JZB2QLZ3WZDHSZAC10JOO0JY4VGDOF0IU3E5AH',
    success: function(data){
    	var base = data.response.groups[0].items

    	$.each(base, function(index){

    		var url = base[index].venue.url;
    		var llat = base[index].venue.location.lat;
    		var llng = base[index].venue.location.lng;
    		var name = base[index].venue.name;
    		var icon = base[index].venue.categories[0].icon;

    		var myIcon = L.icon({
    		    iconUrl: icon,
    		    iconSize: [20, 20],
    		    iconAnchor: [10, 10],
    		    className: '4sq-icon'
    		});

          console.log("name");
    		// var marker = L.marker([llat, llng], {icon: myIcon}).addTo(map);
    		// var content = '<a href="' + url + '" />' + name + '</a>'
    		// marker.bindPopup(content)
    	})
    }
});
