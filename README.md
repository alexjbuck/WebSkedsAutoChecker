# WebSkedsAutoChecker

## Overview
This project aims to create a **JavaScript** program that runs via [**PhantomJS**](http://phantomjs.org/) to check if the [CNATRA Web Schedule](http://www.cnatra.navy.mil/scheds/) is posted and grab a copy if it is.

The uptime of the CNATRA website is very poor so this creates a local copy anytime it is found to be up. The script first checks if a local copy exists, if it does it sleeps for some time before checking again. If a local copy does not exist it attempts to connect to the CNATRA webpage and request the schedule. Currently this is achieved via a screen rendering to PNG of the schedule. Both the full squadron schedule and the name-filtered results are taken as screen captures. Additionally the page source is written out to file for the name-filtered schedule result. This will facilitate eventual parsing of schedule data text from the web page contents.

### Invocation
The script is invoked by calling ```./main.sh``` This script was written for BASH and I make no guarantees it works on any other shell environment.

### Requirements
You must have the **PhantomJS** executable, ```phantomjs``` and the **cURL** executable ```curl``` installed onto your system and be on your system path for the shell environment that _main.sh_ is being called from.


### User Options
You determine several parameters, listed below, in the beginning of the _main.sh_ script.
```
## USER OPTIONS ##
##################
# Your Squadron
SQUADRON='VT-6'
# Your filter name
NAME='buck'
# Your phone number for text notification that schedule has been recorded.
PHONENUM=6302072555
# Location of your Google Drive directory
GOOGLEDRIVEDIR='/Users/alexanderbuck/Google Drive/WebSchedule/'
# How long to sleep between attempts
SLEEPTIME=60
# Keep looking for the next day schedule up until this hour on that day
POLLUNTIL=8
# Switch to lower frequency polling at this hour
POLLSTOP=8
# Switch back to higher frequency polling at this hour
POLLSTART=14
```

## Future implementation
 To include:
 - Garbage collection / removing old files (deciding how many to keep)
 - Text extraction from page data
 - ~~SMS or Email notification of schedule and front page~~
 - Support for querying multiple names over multiple squadrons
 - Possibly shifting to [CasperJS](http://www.casperjs.org) to let it handle the lower-level navigation work that we don't need access to
