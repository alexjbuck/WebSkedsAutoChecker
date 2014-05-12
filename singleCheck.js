var page = require('webpage').create();
var fs = require("fs");

var address = 'http://www.cnatra.navy.mil/scheds/schedule_data.aspx?sq=vt-6';

page.onLoadStarted = function() {
  loading = true;
  loaded = false;
  console.log('Attempting to load address.');
}
page.onLoadFinished = onPageLoad;

var loading = true;
var loaded = false;
var index = 0;
var NAME = 'buck';
page.open(address);

setInterval(function () {
  fs.write("/dev/stdout", ".", "w");
  if (!loaded || loading){
    return;
  }
  if (typeof steps[index] != 'function') {
    console.log('Script Complete!');
    phantom.exit();
  }
  if (!loading && typeof steps[index] == 'function') {
    console.log('');
    console.log('Executing Step ' + (index+1));
    steps[index++]();
  }
},250);


steps = [
  function() {
    console.log(' - Initial Render.');
    page.render('page1.png');
  },
  function() {
    console.log(' - Changing Date.');
    page.evaluate( function() {
      __doPostBack('ctrlCalendar','5242');
    });
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Second Render.');
    page.render('page2.png');
  },
  function() {
    console.log(' - Loading Schedule.');
    page.evaluate( function() {
      document.form1.__EVENTTARGET.value='btnViewSched';
      document.form1.__EVENTARGUMENT.value='';
      document.form1.submit();
    });
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Third Render.');
    page.render('page3.png');
  },
  fuction() {
    console.log(' - Filtering by name.');
    page.evaluate( function() {
      document.getElementById('txtNameSearch').value = NAME;
      document.form1.__EVENTTARGET.value='btnFilter';
      document.form1.__EVENTARGUMENT.value='';
      document.form1.submit();
    });
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Fourth Render.');
    page.render('page4.png');
  }
]
/*  __doPostBack('ctrlCalendar',date);
    document.form1.__EVENTTARGET.value='btnViewSched'      =====     Or can use document.forms[0].etc
    document.form1.__EVENTARGUMENT.value=''                =====     Or can use document.forms[0].etc
    **** IF VALID SCHEDULE RETURNED ****
    document.getElementById('txtNameSearch').value = 'buck'
    document.form1.__EVENTTARGET.value='btnFilter'
    document.form1.__EVENTARGUMENT.value=''
    **** ELSE ABORT ATTEMPT ****

*/

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

function onPageLoad(status) {
  loading = false;
  loaded = false;
  if(status=='success') {
    loaded = page.evaluate(function() {return document.title=='CNATRA Web Schedules';});
    if (loaded) {
      console.log('');
      console.log('Successfully loaded the address!');
      loaded = true;
    } else {
      console.log('');
      console.log('Website was not fully loaded!');
      loaded = false;
    }
  } else {
    console.log('');
    console.log('Unable to load the address!');
    loaded = false;
  }
}
