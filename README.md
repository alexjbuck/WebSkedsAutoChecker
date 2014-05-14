WebSkedsAutoChecker
===================

This project aims to create a javascript program that runs via PhantomJS (http://phantomjs.org/) to check if the CNATRA Web Schedule (http://www.cnatra.navy.mil/scheds/) is posted and grab a copy if it is.

The uptime of the CNATRA website is very poor so this creates a local copy anytime it is found to be up.

Currently this is achieved via a screen rendering to PNG of the schedule.

Future implementation to include:
 - Text extraction from page data
 - SMS or Email notification of schedule and front page
 - Support for querying multiple names over multiple squadrons
 - Possibly shifting to CasperJS to let it handle the lower-level navigation work that we don't need access to
