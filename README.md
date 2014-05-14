# WebSkedsAutoChecker
===================

## Overview
This project aims to create a **JavaScript** program that runs via [**PhantomJS**](http://phantomjs.org/) to check if the [CNATRA Web Schedule](http://www.cnatra.navy.mil/scheds/) is posted and grab a copy if it is.

The uptime of the CNATRA website is very poor so this creates a local copy anytime it is found to be up. The script first checks if a local copy exists, if it does it sleeps for some time before checking again. If a local copy does not exist it attempts to connect to the CNATRA webpage and request the schedule. Currently this is achieved via a screen rendering to PNG of the schedule. Both the full squadron schedule and the name-filtered results are taken as screen captures.

### Invocation
The script is invoked by calling _main.sh_ shell script. This script was written for BASH and I make no guarantees it works on any other shell environment.

### Requirements
You must have the **PhantomJS** executable, _phantomjs_, installed onto your system and be on your system path for the shell environment that _main.sh_ is being called from.

### User Options
You determine which squadron to check and which name to filter for in the beginning of the _main.sh_ script.

## Future implementation
 To include:
 - Garbage collection / removing old files (deciding how many to keep)
 - Text extraction from page data
 - SMS or Email notification of schedule and front page
 - Support for querying multiple names over multiple squadrons
 - Possibly shifting to [CasperJS](http://www.casperjs.org) to let it handle the lower-level navigation work that we don't need access to
