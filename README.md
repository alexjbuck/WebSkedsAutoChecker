# WebSkedsAutoChecker

## Overview
A program that downloads the [CNATRA Web Schedule](http://www.cnatra.navy.mil/scheds/) using [**PhantomJS**](http://phantomjs.org/) and sends SMS notifications via [TextBelt API](http://textbelt.com/)

The uptime of the CNATRA website is very poor so this creates a local copy anytime it is found to be up. The script first checks if a local copy exists, if it does it sleeps for some time before checking again. If a local copy does not exist it attempts to connect to the CNATRA webpage and request the schedule. Both the full squadron schedule and the name-filtered results are taken as screen captures. Additionally the page source is parsed for the name-filtered schedule result which is sent as a text message via the TextBelt API to the cell phone number on file.

### Requirements
You must have the **PhantomJS** executable, ```phantomjs``` and the **cURL** executable ```curl``` installed onto your system and be on your system path for the shell environment that ```skeds``` is being called from.

### Invocation
The script help text is invoked by calling ```skeds``` This script was written for BASH and I make no guarantees it works on any other shell environment. The usage section below describes the various option / parameter flags to supply.

### Usage
You determine several parameters, listed below, as passed to the ```skeds``` script.
```
Usage:  skeds [-f] [-s] [-v] [-sq SQUADRON] [-tw TRAWING]
              [-n NAME] [-pn PHONENUMBER] [-gd GOOGLEDRIVEDIR]
              [-st SLEEPTIME] [-ps POLLSTART] [-pu POLLUNTIL]
              [--fpdir FPDIR] [--pngdir PNGDIR]
        skeds -h
        skeds --help

Optional Flags:
    -h, --help      Show the usage information
    -f, --force     Force downloading of schedule/front paage even if they have
                      already been downloaded.
    -v, --verbose   Print more verbose output statements
    -s, --silent    Suppres all output statements (overrides -v). Logs output to 'log'

Key/Value Parameters:
    -sq,--squadron squadron
              Set the user squadron (e.g. 'VT-6', 'HT-8')

    -tw,--trawing trawing
              Set the user training wing (e.g. tw5, TW5, TW1)

    -n,--name name
              Set the user name for schedule filtering

    -pn,--phonenumber number
              Set the user phone number for SMS notification

    -gd,-googledrive directory
              Set location of the user google drive directory

    -st,--sleeptime seconds
              Set sleep duration between subsequent polling attempts

    -ps,--pollstart hour
              Set what hour (24 hour) the polling for the next days schedule begins

    -pu,--polluntil hour
              Set what hour (24 hour) the polling for the current days schedule ends

    --fpdir directory
              Set the directory where the Frontpage will be saved

    --pngdir directory
              Set the directory where the schedule snapshots will be saved
```

## Future implementation
 To include:
 - Garbage collection / removing old files (deciding how many to keep)
 - Implement google drive support on raspberry pi
 - Support for querying multiple names over multiple squadrons
 - Possibly shifting to [CasperJS](http://www.casperjs.org) to let it handle the lower-level navigation work that we don't need access to
