/*
  Exit Codes
  0 - Normal
  1 - Failed to load the page
  2 - The service is unavailable
  3 - Bad date selected
*/

var page = require('webpage').create();
var fs = require("fs");

var address = 'http://www.cnatra.navy.mil/scheds/schedule_data.aspx?sq=vt-6';
var addressFP = 'http://www.cnatra.navy.mil/scheds/tw5/SQ-VT-6/$2014-05-13$VT-6$Frontpage.pdf'

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
  console.log('');
  if (typeof steps[index] != 'function') {
    console.log('Script Complete!');
    phantom.exit(0);
  }
  if (!loading && typeof steps[index] == 'function') {
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
      __doPostBack('ctrlCalendar','5246');
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
  function() {
    console.log(' - Filtering by name.');
    page.evaluate( function() {
      document.getElementById('txtNameSearch').value = 'buck';
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
  },
  function() {
    // console.log(' - Getting Front Page.');
    // page.evaluate( function() {
    //   document.form1.__EVENTTARGET.value='btnViewFP';
    //   document.form1.__EVENTARGUMENT.value='';
    //   document.form1.submit();
    // });
    page.open(addressFP)
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Fifth Render.');
    page.render('page5.png');
  }
]

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

function onPageLoad(status) {
  loading = false;
  loaded = false;
  console.log('');
  if(status=='success') {
    var title = page.evaluate(function() {return document.title;});
    switch (title) {
      case 'CNATRA Web Schedules':
        loaded = true;
        console.log('Successfully loaded the address!');
        break;
      case '':
        loaded = false;
        console.log('Website appears down!');
        phantom.exit(2);
        break;
      case 'CNATRA Web Schedules - Empty Schedule':
        loaded = false;
        console.log('The schedule for the selected date has not yet posted.');
        phantom.exit(3);
        break;
    }
  } else {
    console.log('Unable to load the address!');
    loaded = false;
    phantom.exit(1);
  }
}
