#!/bin/bash
# 6-27-2016 jchoy

while true; do
  date >> pub_html/bumstart.log
  node server-bum.js
  sleep 30
done
