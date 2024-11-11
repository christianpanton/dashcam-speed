const fileinput = document.getElementById("fileinput");
const uploadicon = document.getElementById("uploadicon");
const video = document.getElementById("video");
const canvas = document.getElementById("videocanvas");
const map = document.getElementById("map");

const videoMetadata = {
  loaded: false,
  framerate: 0,
  duration: 0,
  framecount: 0,
  height: 0,
  width: 0,
  aspect: 0,
  drawRatio: 0,
};

let activeFrame = {
  x: 0,
  y: 0,
  lat: 0,
  lng: 0,
  sec: 0,
  frame: 0,
};

function initMap() {
  const leafletMap = L.map("map").setView([55.663654, 12.367], 17);
  
  const marker = L.circle([55.663654, 12.367], 1, {
    color: 'red',
    fillOpacity: 0.5,
    opacity: 0.9,
    radius: 1,
  });

  marker.addTo(leafletMap);

  const onMapClick = (event) => {
    const latlng = event.latlng;

    marker.setLatLng(latlng);
    activeFrame.lat = latlng.lat;
    activeFrame.lng = latlng.lng;
  };

  setTimeout(function () {
    leafletMap.invalidateSize();
  }, 400);

  leafletMap.on("click", onMapClick);

  L.tileLayer(
    "https://osmtools.septima.dk/mapproxy/tiles/1.0.0/kortforsyningen_ortoforaar/EPSG3857/{z}/{x}/{y}.jpeg",
    {
      attribution: "&copy; Styrelsen for Dataforsyning og Infrastruktur",
      maxZoom: 21,
      minZoom: 0,
    }
  ).addTo(leafletMap);
}

function initVideo() {
  // hooks for registering video resizing matching overlay
  const onVideoResize = () => {
    // ensure everything looks good for retina displays, operate on native X, Y pos of video rather than scaled coords
    canvas.height = videoMetadata.height;
    canvas.width = videoMetadata.width;
    canvas.style.height = video.clientHeight + "px";
    canvas.style.width = video.clientWidth + "px";
    videoMetadata.drawRatio = videoMetadata.height / video.clientHeight;

    map.style.height = video.clientHeight + "px";
    uploadicon.style.height = video.clientHeight + "px";
    drawVideoOverlay(canvas, activeFrame);
  };

  // ensure that controls know the current time
  const onVideoTimeUpdate = () => {
    const frame = Math.round(video.currentTime * videoMetadata.framerate);
    activeFrame.sec = video.currentTime;
    activeFrame.frame = frame;
    updateControls(frame, video.currentTime, videoMetadata.framecount, videoMetadata.duration);
  };

  setFrame = (frame) => { 
    console.log("setting frame", frame, frame / videoMetadata.framerate);
    video.currentTime = (frame / videoMetadata.framerate) + 0.00001;
    onVideoTimeUpdate();
  }

  setSec = (sec) => {
    video.currentTime = sec;
    onVideoTimeUpdate();
  }

  new ResizeObserver(onVideoResize).observe(video);

  video.oncanplay = () => {
    onVideoTimeUpdate();
    onVideoResize();
  }; 

  video.addEventListener('timeupdate', (event) => {
    onVideoTimeUpdate();
  });

  onVideoResize();

  // update media info when new video file is selected
  const onChangeFile = (mediainfo) => {
    const file = fileinput.files[0];
    if (!file) return;

    const readChunk = async (chunkSize, offset) =>
      new Uint8Array(
        await file.slice(offset, offset + chunkSize).arrayBuffer()
      );

    mediainfo.analyzeData(file.size, readChunk).then((result) => {
      Object.assign(videoMetadata, getVideoMetadata(result));
      video.setAttribute("src", URL.createObjectURL(file));
    });
  };

  MediaInfo.mediaInfoFactory({ format: "JSON" }, (mediainfo) => {
    fileinput.addEventListener("change", () => onChangeFile(mediainfo));
  });

  const processCursorEvent = (event) => {
    const rect = canvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * videoMetadata.drawRatio;
    const y = (event.clientY - rect.top) * videoMetadata.drawRatio;

    if (event.type === "mousemove") {
      activeFrame.draftX = x;
      activeFrame.draftY = y;
    } else {
      activeFrame.x = x;
      activeFrame.y = y;
    }

    drawVideoOverlay(canvas, activeFrame);
  };

  // add click event listener for the video
  canvas.addEventListener("click", (event) => {
    if (!videoMetadata.loaded) {
      fileinput.click();
      return;
    }
    processCursorEvent(event);
  });

  canvas.addEventListener("mousemove", processCursorEvent);
  canvas.addEventListener("mouseleave", () => {
    activeFrame.draftX = null;
    activeFrame.draftY = null;
    drawVideoOverlay(canvas, activeFrame);
  });
}
