#!/bin/bash
echo ''
echo '************ WebSkedsAutoChecker ************'
echo '*             by Alexander Buck             *'
echo '*********************************************'

FPDIR='./FrontPage'

SQUADRON='VT-6'
NAME='buck'
SLEEPTIME=20
declare -i JULIAN
declare -i CALDATE


while : ; do

  JULIAN=$(date -v+1d +%j)
  # Conversion: 5245 == Julian Date 132 (May 12th, 2014)
  CALDATE=JULIAN+5113
  DATESTR=`date -v+1d +%Y-%m-%d`

  if [ -f "$FPDIR/\$$DATESTR\$$SQUADRON\$Frontpage.pdf" ]
  then
    echo '++ Front page already downloaded.'
  else
    echo '**'
    echo '** Downloading the front page.'
    echo '**'
    URL='http://www.cnatra.navy.mil/scheds/tw5/SQ-VT-6/$'$DATESTR'$'$SQUADRON'Frontpage.pdf'
    curl -o $FPDIR'/$'$DATESTR'$'$SQUADRON'Frontpage.pdf' $URL
    OUT=$?
    if [ $OUT -eq 0 ];then
       echo "++ Successfully downloaded front page."
    else
       echo "xx"
       echo "xx Failed to download front page."
       echo "xx"
    fi
  fi


  if [  -f "./PNGs/page3_$CALDATE.png"  -a  -f "./PNGs/page4_$CALDATE.png" ]; then
    echo "++ Schedule already downloaded."
  else
    echo '**'
    echo '** Downloading schedule.'
    echo '**'
    phantomjs singleCheck.js $JULIAN $NAME

    OUT=$?
    if [ $OUT -eq 0 ];then
       echo "++ Successfully downloaded schedule."
       echo '++ Copying files to google drive for sharing.'
       cp -R ./FrontPage '/Users/alexanderbuck/Google Drive/WebSchedule/'
       cp -R ./PNGs '/Users/alexanderbuck/Google Drive/WebSchedule/'
    else
       echo "xx"
       echo "xx Failed to download schedule."
       echo "xx"
    fi
  fi

  echo "It is now: `date`"
  echo "Sleeping for $SLEEPTIME"
  echo -n "zzz... "
  sleep $SLEEPTIME
  echo " ...yawn"

done
