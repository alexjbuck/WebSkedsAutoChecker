var page = require('webpage').create();
var fs   = require('fs')

var attempts = 0;
var address = 'http://www.cnatra.navy.mil/scheds/schedule_data.aspx?sq=vt-6';
// var address = 'http://localhost:8888/';
var d = new Date()

page.onLoadFinished = onPageLoad;

intervalVar = setInterval(function() {getSchedule()},1000);

function onPageLoad(status) {
  if(status!=='success'){

    console.log('Unable to load the address!');
    // getSchedule();
    

  } else {

    console.log('Successfully loaded the address!');
    // page.render(makeDateTimeGroup(d) + '.png');

    var title = page.evaluate( function() {
      return document.title;
    });

    if (title == '') {
      console.log('Loaded page did not have title! Attempting again.');
      // phantom.exit();
    } else {
      clearInterval(intervalVar);
      fs.write('./dump.html',page.content,'w');
      // console.log(page.content);
      phantom.exit();
    }
  }
}

function getSchedule() {
  console.log('Attempting to load address. Attempt: ' + ++attempts);
  page.open(address);
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
