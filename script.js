const apiKey = '0fc34377c3d4d58c829a0907b8a6d7ed';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=La Paz,BO&appid=${apiKey}&units=metric`;
const timeUrl = 'https://worldtimeapi.org/api/ip';

async function getWeatherData() {
  const response = await fetch(weatherUrl);
  const data = await response.json();
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const weatherElement = document.querySelector('.weather');
  const tempElement = weatherElement.querySelector('.temp');
  const descElement = weatherElement.querySelector('.desc');
  tempElement.textContent = `${temp}°C`;
  descElement.textContent = desc;
}

async function getTimeData() {
    const response = await fetch(timeUrl);
    const data = await response.json();
    const currentTime = new Date(); // Obtiene la hora actual del usuario
    const utcOffset = data.utc_offset; // Obtiene el offset UTC de la ubicación del usuario en segundos
    const localTime = new Date(currentTime.getTime()); // Obtiene la hora local del usuario
    const date = localTime.toISOString().split('T')[0]; // Obtiene la fecha local en formato ISO y la separa del tiempo
    const time = localTime.toLocaleTimeString(); // Obtiene la hora local en formato local
    const timeElement = document.querySelector('.time');
    const dateElement = timeElement.querySelector('.date');
    const clockElement = timeElement.querySelector('.clock');
    dateElement.textContent = date;
    clockElement.textContent = time;
}

getWeatherData();
/* call getTimeData every second */
setInterval(getTimeData, 1000);

setInterval(function ( ) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("adc").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "/adc", true);
  xhttp.send();
}, 10000 );

function update(val) {
  console.log(val);
  document.getElementById('pwmInput').value = val ; 
  document.getElementById('textInput').value = val; 
}

// Get current sensor readings when the page loads  
window.addEventListener('load', getReadings);

// Create Temperature Gauge
var gaugeTemp = new LinearGauge({
  renderTo: 'gauge-temperature',
  width: 120,
  height: 400,
  units: "Dato 1",
  minValue: 0,
  startAngle: 90,
  ticksAngle: 180,
  maxValue: 40,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueDec: 2,
  valueInt: 2,
  majorTicks: [
      "0",
      "5",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40"
  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 30,
          "to": 40,
          "color": "rgba(200, 50, 50, .75)"
      }
  ],
  colorPlate: "#fff",
  colorBarProgress: "#CC2936",
  colorBarProgressEnd: "#049faa",
  borderShadowWidth: 0,
  borders: false,
  needleType: "arrow",
  needleWidth: 2,
  needleCircleSize: 7,
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear",
  barWidth: 10,
}).draw();
  
// Create Humidity Gauge
var gaugeHum = new RadialGauge({
  renderTo: 'gauge-humidity',
  width: 300,
  height: 300,
  units: "Dato 2 (%)",
  minValue: 0,
  maxValue: 100,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueInt: 2,
  majorTicks: [
      "0",
      "20",
      "40",
      "60",
      "80",
      "100"

  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 80,
          "to": 100,
          "color": "#03C0C1"
      }
  ],
  colorPlate: "#fff",
  borderShadowWidth: 0,
  borders: false,
  needleType: "line",
  colorNeedle: "#007F80",
  colorNeedleEnd: "#007F80",
  needleWidth: 2,
  needleCircleSize: 3,
  colorNeedleCircleOuter: "#007F80",
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear"
}).draw();

// Function to get current readings on the webpage when it loads for the first time
function getReadings(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      console.log(myObj);
      var temp = myObj.temperature;
      var hum = myObj.humidity;
      gaugeTemp.value = temp;
      gaugeHum.value = hum;
    }
  }; 
  xhr.open("GET", "/readings", true);
  xhr.send();
}

if (!!window.EventSource) {
  var source = new EventSource('/events');
  
  source.addEventListener('open', function(e) {
    console.log("Events Connected");
  }, false);

  source.addEventListener('error', function(e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnected");
    }
  }, false);
  
  source.addEventListener('message', function(e) {
    console.log("message", e.data);
  }, false);
  
  source.addEventListener('new_readings', function(e) {
    console.log("new_readings", e.data);
    var myObj = JSON.parse(e.data);
    console.log(myObj);
    gaugeTemp.value = myObj.temperature;
    gaugeHum.value = myObj.humidity;
  }, false);
}