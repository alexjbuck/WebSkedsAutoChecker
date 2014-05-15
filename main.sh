#!/bin/bash
echo ''
echo '************ WebSkedsAutoChecker ************'
echo '*             by Alexander Buck             *'
echo '*********************************************'

if [ `which phantomjs` ]; then
  echo
else
  echo "I cannot find phantomjs on your path."
  echo "Please download and/or install it first."
  echo "Exiting..."
  echo
  exit 1
fi
if [ `which curl` ]; then
  echo
else
  echo "I cannot find cURL on your path."
  echo "Please download and/or install it first."
  echo "Exiting..."
  echo
  exit 2
fi


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


# Flags to indicate if the current schedule and frontpage has been downloaded
GOTSKED=false
GOTFP=false
# Name of FrontPage directory
FPDIR='./FrontPage'


declare -i JULIAN
declare -i CALDATE

# Begin polling loop
while : ; do

  if [ $(date +%H) -lt $POLLUNTIL ]; then
    if [ "$GOTSKED" = false ] || [ "$GOTFP" = false ]; then
      # Set the date for the current day
      JULIAN=$(date +%j)
      DATESTR=$(date +%Y-%m-%d)
    else
      # I already have both, set the date for the next day
      JULIAN=$(date -v+1d +%j)
      DATESTR=$(date -v+1d +%Y-%m-%d)
    fi
  else
    # Its after "$SEARCHUNTIL" time, so give up on today and move to tomorrow
    JULIAN=$(date -v+1d +%j)
    DATESTR=$(date -v+1d +%Y-%m-%d)
  fi

  # Conversion: 5245 == Julian Date 132 (May 12th, 2014)
  CALDATE=JULIAN+5113



  if [ -f "$FPDIR/\$$DATESTR\$$SQUADRON\$Frontpage.pdf" ]
  then
    echo '++ Front page already downloaded.'
    GOTFP=true
  else
    GOTFP=false
    echo '**'
    echo '** Downloading the front page.'
    echo '**'

    URL=http://www.cnatra.navy.mil/scheds/tw5/SQ-VT-6/\$$DATESTR\$$SQUADRON\$Frontpage.pdf

    curl -s -S --create-dirs --fail -o $FPDIR/\$$DATESTR\$$SQUADRON\$Frontpage.pdf $URL

    if [ $? -eq 0 ];then
       echo "++ Successfully downloaded front page."
       curl http://textbelt.com/text -d number=$PHONENUM -d message=\
       "Front page for $DATESTR now on Google Drive."
    else
       echo "xx"
       echo "xx Failed to download front page."
       echo "xx"
    fi
  fi


  if [  -f ./PNGs/$CALDATE\page3.png  -a  -f ./PNGs/$CALDATE\page4.png ]; then
    echo "++ Schedule already downloaded."
    GOTSKED=true
  else
    GOTSKED=false
    echo '**'
    echo '** Downloading schedule.'
    echo '**'

    phantomjs singleCheck.js $JULIAN $NAME

    if [ $? -eq 0 ];then
       echo "++ Successfully downloaded schedule."
       echo '++ Copying files to google drive for sharing and sending SMS notification.'
       curl http://textbelt.com/text -d number=$PHONENUM -d message=\
       "Schedule for $DATESTR now on Google Drive."
       cp -R ./FrontPage $GOOGLEDRIVEDIR
       cp -R ./PNGs $GOOGLEDRIVEDIR
    else
       echo "xx"
       echo "xx Failed to download schedule."
       echo "xx"
    fi
  fi

  echo "It is now: `date`"
  if [ "$GOTSKED" = true ] && [ "$GOTFP" = true ]; then
    # We already have both the Front page and Schedule that we are looking for
    SLEEPTIME=1800
  else
    # We still don't have one of them, keep polling if within the valid window
    if [ $(date +%H) -ge $POLLSTART ] || [ $(date +%H) -lt $POLLSTOP ]; then
      # Inside desired polling timeframe (1400-0800 local time)
      # Poll once per minute
      SLEEPTIME=60
    else
      # Outside desired polling timeframe
      # Poll once per 30 minutes
      SLEEPTIME=1800
    fi
  fi

  echo "Sleeping for $SLEEPTIME"
  echo -n "zzz... "
  sleep $SLEEPTIME
  echo " ...yawn"

done
