$(document).ready(function() {
  var jsonDataSrc = "gallery_json.txt";
  var jsonData = null;
  var currIndex = -99;
  var loadedImages = {};


  function loadImageContainer(img) {
    $("#image_container").empty();
    $("#image_container").append(img);
  }

  function showImage(index) {
    if(!jsonData) { return; }
    if(index < 0) { index = 0; }
    else if(index > jsonData.photos.length - 1) {
      index = jsonData.photos.length - 1;
    }
    if(currIndex == index) { return; }
    currIndex = index;

    // highlight thumbnail 
    $("#thumbnails img").removeClass("selected")
    $("#thumb_"+index).addClass("selected");

    // show the large image
    var img = loadedImages[index];
    if(!img) { 
      img = new Image();
      img.onload = function(e) {
        loadImageContainer(img);
	loadedImages[index] = img;
      }
      img.src = jsonData.photos[index].url;
    } else {
      loadImageContainer(img);
    }

    $("#image_title").html(jsonData.photos[index].title || "untitled");
    var imageInfo = "";

    // gracefully handle missing date or location or both
    if(jsonData.photos[index].date) {
      imageInfo += " on " + jsonData.photos[index].date;
    }
    if(jsonData.photos[index].location) {
      imageInfo += " in " + jsonData.photos[index].location;
    }
    if(imageInfo) {
      imageInfo = "Taken " + imageInfo;
    }

    $("#image_info").html(imageInfo);
  }

  function showThumbs(photos) {
    if(!photos) { return; }

    var thumbHtml = "<ul>";
    for(var i in photos) {
      thumbHtml += "<li><img id=\"thumb_" + i + "\" src=\"" + photos[i].thumb_url + "\"/></li>";
    }
    thumbHtml += "</ul>";
    $("#thumbnails").html(thumbHtml);

    // add click handler
    $("#thumbnails img").click(function(e) {
      var imageId = e.target.id;
      var imageIndex = 1 * imageId.substr(imageId.indexOf("_")+1)
      showImage(imageIndex);
    });

    showImage(0);
  }

  function showGallery(data) {
    if(!data) { return; }
    jsonData = data;

    $("#album_title").html(data.album.name);

    // generate thumbnail list
    showThumbs(data.photos);
  }

  $.ajax({url:jsonDataSrc, success:function(data, status) {
    showGallery(JSON.parse(data));
  }, error: function() {
    // do error handling
  }});

  // install handlers for the prev and next buttons
  $("#link_prev").click(function(e){
    showImage(currIndex - 1);
  });

  $("#link_next").click(function(e){
    showImage(currIndex + 1);
  });

  // also enable left and right keys for navigation
  $(document).keydown(function(e){
    if(e.keyCode == 39) {
      $("#link_next").click();
    } else if(e.keyCode == 37) {
      $("#link_prev").click();
    }
  });

});