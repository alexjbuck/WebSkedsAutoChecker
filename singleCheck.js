/*
  Exit Codes
  0 - Normal
  1 - Failed to load the page
  2 - The service is unavailable
  3 - Bad date selected
  4 - Bad arguments
*/
var page = require('webpage').create();
var fs = require("fs");
var sys = require("system");
var args = sys.args;

var address_template = 'http://www.cnatra.navy.mil/scheds/schedule_data.aspx?sq=';
var address = '';

var loading = true;
var loaded = false;
var index = 0;
var NAME='';
var CALDATE='';
var SQUADRON='';
var JDATE2CALDATE = 5113;
var PNGDIR = '/PNGs/';



// IN PROGRESS
// shift out the first input because it is the name of the calling javascript file (these are inputs relative to the 'phantomjs' call)
/*
args.shift();
while(args.length>0){
  key=args[0];
  args.shift();
  switch(key) {
    case "-n": // Fallthrough
    case "--name":
      NAME=args[0];
      args.shift();
      break;
    case "-d": // Fallthrough
    case "--date":
      JDATE=args[0];
      args.shift();
      break;
  }
}
*/
i=1; // Index 0 is singleCheck.js
while (i<args.length) {
  key = args[i++];
  switch (key) {
    case '-j':
    case '--julian':
      CALDATE = String(parseInt(args[i++])+JDATE2CALDATE);
      break;
    case '-n':
    case '--name':
      NAME = String(args[i++]);
      break;
    case '-sq':
    case '--squadron':
      SQUADRON= String(args[i++]);
      address = address_template + SQUADRON;
      break;
  }
}

if (NAME==''){
  console.log('Must supply a name');
  phantom.exit(4);
}
if (CALDATE==''){
  console.log('Must supply a date');
  phantom.exit(4);
}
if (SQUADRON=''){
  console.log('Must supply a squadron');
  phantom.exit(4);
}

/*
if (args.length>=4) {
  console.log('phantomjs singleCheck.js (JDATE) (NAME) (SQUADRON)');
  console.log('Usage Error.');
  console.log('Too many arguments provided. 0, 1, or 2 arguments are required, the Julian Date of the requested day');
  console.log('Shutting Down...');
  phantom.exit(4);
} else if (args.length<=1) {
  // console.log('No date provided... Using default date and name.');
  NAME = 'buck';
  // skip changing the date, use todays date as loaded on the page
  index = 2;
} else if (args.length==2) {
  CALDATE = String(parseInt(args[1])+JDATE2CALDATE);
  // console.log('Looking up Schedule for default name on Julian Date: ' + args[1] + ' (CalDate: ' + CALDATE + ')');
} else if (args.length==3) {
  CALDATE = String(parseInt(args[1])+JDATE2CALDATE);
  NAME=String(args[2]);
  // console.log('Looking up Schedule for "' + NAME + '" on Julian Date: ' + args[1] + ' (CalDate: ' + CALDATE + ')');
};
*/




shortSteps = [
  function() {
    console.log(' - Initial Render.');
    //page.render('./' + NAME + PNGDIR + CALDATE +'page1.png');
  },
  function() {
    console.log(' - Changing Date.');
    page.evaluate( function(CALDATE) {
      __doPostBack('ctrlCalendar',CALDATE);
    },CALDATE);
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Filtering by name.');
    page.evaluate( function(NAME) {
      document.getElementById('txtNameSearch').value = NAME;
      document.forms[0].__EVENTTARGET.value='btnFilter';
      document.forms[0].__EVENTARGUMENT.value='';
      document.forms[0].submit();
    },NAME);
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Render.');
    page.render('./' + NAME + PNGDIR + CALDATE + 'page4.png');
    // This is for debug/testing/backup purposes
    // fs.write('./dump.html',page.content,'w');
    // Extract the Schedule
    var schedule = page.evaluate( function() {
      var dataTable = document.getElementById("dgEvents");
      var rows = dataTable.querySelectorAll("tr");
      console.log(dataTable);
      console.log(rows[0]);
      console.log(rows.length)
      var schedule='';
      if (rows.length<=1){
        schedule = ' Hooray! Not scheduled!'
      } else {
        for(var i=1;i<rows.length;i++){
          console.log(rows[i].innerText);
          var cells = rows[i].querySelectorAll("td");
          if(i>1){
            schedule += ' //'
          }
          for(var j=0;j<cells.length;j++){
            if(j!=1 && j!=3 && j!=4 && j!=6 && j!=8){
              if(cells[j].innerHTML!='&nbsp;'){
                console.log(j);
                console.log(cells[j].innerText);
                schedule += ' ' + cells[j].innerText;
              }
            }
          }
        }
      }
      console.log(schedule.length);
      return schedule
    });
    // console.log(schedule);
    fs.write(NAME+'/schedule_'+NAME,schedule,'w');
  }
]

longSteps = [
  function() {
    console.log(' - Initial Render.');
    //page.render('./' + NAME + PNGDIR + CALDATE +'page1.png');
  },
  function() {
    console.log(' - Changing Date.');
    page.evaluate( function(CALDATE) {
      __doPostBack('ctrlCalendar',CALDATE);
    },CALDATE);
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Second Render.');
    //page.render('./' + NAME + PNGDIR + CALDATE + 'page2.png');
  },
  function() {
    console.log(' - Loading Schedule.');
    page.evaluate( function() {
      document.forms[0].__EVENTTARGET.value='btnViewSched';
      document.forms[0].__EVENTARGUMENT.value='';
      document.forms[0].submit();
    });
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Third Render.');
    page.render('./' + NAME + PNGDIR + CALDATE +'page3.png');
  },
  function() {
    console.log(' - Filtering by name.');
    page.evaluate( function(NAME) {
      document.getElementById('txtNameSearch').value = NAME;
      document.forms[0].__EVENTTARGET.value='btnFilter';
      document.forms[0].__EVENTARGUMENT.value='';
      document.forms[0].submit();
    },NAME);
    // These flag changes are only here as a safeguard
    loading = true;
    loaded = false;
  },
  function() {
    console.log(' - Fourth Render.');
    page.render('./' + NAME + PNGDIR + CALDATE + 'page4.png');
    // This is for debug/testing/backup purposes
    // fs.write('./dump.html',page.content,'w');
    // Extract the Schedule
    var schedule = page.evaluate( function() {
      var dataTable = document.getElementById("dgEvents");
      var rows = dataTable.querySelectorAll("tr");
      console.log(dataTable);
      console.log(rows[0]);
      console.log(rows.length)
      var schedule='';
      if (rows.length<=1){
        schedule = ' Hooray! Not scheduled!'
      } else {
        for(var i=1;i<rows.length;i++){
          console.log(rows[i].innerText);
          var cells = rows[i].querySelectorAll("td");
          if(i>1){
            schedule += ' //'
          }
          for(var j=0;j<cells.length;j++){
            if(j!=1 && j!=3 && j!=4 && j!=6 && j!=8){
              if(cells[j].innerHTML!='&nbsp;'){
                console.log(j);
                console.log(cells[j].innerText);
                schedule += ' ' + cells[j].innerText;
              }
            }
          }
        }
      }
      console.log(schedule.length);
      return schedule
    });
    // console.log(schedule);
    fs.write(NAME+'/schedule',schedule,'w');
  }
]



page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onConsoleMessage = function(msg) {
  console.log('>> ' + msg);
};



page.onLoadStarted = function() {
  loading = true;
  loaded = false;
  console.log('Attempting to load address.');
}

function onPageLoad(status) {
  loading = false;
  loaded = false;
  // console.log('');
  // console.log(page.content);
  if(status=='success') {
    var title = page.evaluate(function() {return document.title;});
    console.log('');
    console.log('Page Loaded, title: ' + title);
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


page.onLoadFinished = onPageLoad;
steps=longSteps;

/*---------------*/
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
/*---------------*/
