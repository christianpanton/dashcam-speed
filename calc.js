let pointA;
let pointB;

const btnSetPointA = document.getElementById("set-point-a");
const btnSetPointB = document.getElementById("set-point-b");

const propertiesPointA = document.getElementById("point-a");
const propertiesPointB = document.getElementById("point-b");
const propertiesResult = document.getElementById("results");

function initCalc() {
  btnSetPointA.addEventListener("click", () => {
    pointA = structuredClone(activeFrame);
    setValue(propertiesPointA, "lat", toFixedIfNecessary(activeFrame.lat, 6));
    setValue(propertiesPointA, "lng", toFixedIfNecessary(activeFrame.lng, 6));
    setValue(propertiesPointA, "sec", activeFrame.sec);
    setValue(propertiesPointA, "frame", activeFrame.frame);
    updateCalc();
  });

  btnSetPointB.addEventListener("click", () => {
    pointB = structuredClone(activeFrame);
    setValue(propertiesPointB, "lat", toFixedIfNecessary(activeFrame.lat, 6));
    setValue(propertiesPointB, "lng", toFixedIfNecessary(activeFrame.lng, 6));
    setValue(propertiesPointB, "sec", activeFrame.sec);
    setValue(propertiesPointB, "frame", activeFrame.frame);
    updateCalc();
  });
}

function updateCalc()
{
    if(!pointA || !pointB)
        return;

    const sec = Math.abs(pointA.sec - pointB.sec);
    const dist = vincenty_distance(pointA.lat, pointA.lng, pointB.lat, pointB.lng);
    const speed = dist/sec;

    setValue(propertiesResult, "sec", toFixedIfNecessary(sec, 2) + " s");
    setValue(propertiesResult, "dist", toFixedIfNecessary(dist, 1) + " m");


    setValue(propertiesResult, "speed", toFixedIfNecessary(speed * 3.6, 0) + " km/h");

}

function setValue(parent, key, value) {
  parent.querySelector("." + key).innerText = value;
}

function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

var earth_radius_km = 6371.0;

function deg_to_rad(deg) {
  return (deg * Math.PI) / 180.0;
}

// thanks
// https://gist.github.com/ed-flanagan/d4048ba6896ce340ab9d

function vincenty_distance(latitude1, longitude1, latitude2, longitude2) {
  var lat1 = deg_to_rad(latitude1);
  var lng1 = deg_to_rad(longitude1);
  var lat2 = deg_to_rad(latitude2);
  var lng2 = deg_to_rad(longitude2);

  var d_lng = Math.abs(lng1 - lng2);

  // Numerator
  var a = Math.pow(Math.cos(lat2) * Math.sin(d_lng), 2.0);

  var b = Math.cos(lat1) * Math.sin(lat2);
  var c = Math.sin(lat1) * Math.cos(lat2) * Math.cos(d_lng);
  var d = Math.pow(b - c, 2.0);

  var e = Math.sqrt(a + d);

  // Denominator
  var f = Math.sin(lat1) * Math.sin(lat2);
  var g = Math.cos(lat1) * Math.cos(lat2) * Math.cos(d_lng);

  var h = f + g;

  var d_sigma = Math.atan2(e, h);

  return earth_radius_km * d_sigma * 1000;
}
