#!/bin/bash
echo '************ WebSkedsAutoChecker ************'
echo '              by Alexander Buck              '
echo ''

FPDIR='./FrontPage'

SQUADRON='VT-6$'
NAME='buck'
declare -i JULIAN
declare -i CALDATE
JULIAN=$(date -v+1d +%j)
# Conversion: 5245 == Julian Date 132 (May 12th, 2014)
CALDATE=JULIAN+5113
DATESTR=`date -v+1d +%Y-%m-%d`

echo '** Downloading the FrontPage.%n'
URL='http://www.cnatra.navy.mil/scheds/tw5/SQ-VT-6/$'$DATESTR'$'$SQUADRON'Frontpage.pdf'
curl -o $FPDIR'/$'$DATESTR'$'$SQUADRON'Frontpage.pdf' $URL

echo '** Downloading Schedule.%n'
phantomjs singleCheck.js $JULIAN $NAME

echo '** Moving Files to Google Drive for Sharing'
cp -R ./FrontPage '/Users/alexanderbuck/Google Drive/WebSchedule/'
cp -R ./PNGs '/Users/alexanderbuck/Google Drive/WebSchedule/'
