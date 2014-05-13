var page = require('webpage').create();
var fs   = require('fs')

var attempts = 0, timeout=5000;
var address = 'http://www.cnatra.navy.mil/scheds/schedule_data.aspx?sq=vt-6';
// var address = 'http://localhost:8888/';
var d = new Date()

page.onLoadStarted = function() {console.log('Attempting to load address. Attempt: ' + ++attempts);
}
page.onLoadFinished = onPageLoad;

// intervalVar = setInterval(function() {getSchedule()},500);
timer = setTimeout(getSchedule, timeout);

function getSchedule() {
  page.open(address);
  timer = setTimeout(getSchedule, timeout);
}

function onPageLoad(status) {
  if(status!=='success'){
    console.log('Unable to load the address!');
  } else {
    console.log('Successfully loaded the address!');

    var title = page.evaluate( function() {
      return document.title;
    });

    if (title == '') {
      console.log('Loaded page did not have title! Attempting again.');
    } else {
      clearInterval(timer);
      fs.write('./dump.html',page.content,'w');
      phantom.exit();
    }
  }
}

// ** Utility Functions **

function printDate(d) {
  console.log(makeDateTimeGroup(d));
}

function makeDateTimeGroup(d) {
  var dtg = String(d.getFullYear()) + addZero(String(d.getMonth()+1)) + addZero(String(d.getDate())) + addZero(String(d.getHours())) + addZero(String(d.getMinutes())) + addZero(String(d.getSeconds()));
  return dtg
}

function addZero(str) {
  if (str.length>2) {
    console.error('Error -- addZero::string "' + str + '" had more than 2 characters');
    return str;
  } else if (str.length==2) {
    return str;
  } else if (str.length==1) {
    return '0'+str;
  }
}
