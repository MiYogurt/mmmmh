#!/usr/bin/env bash

function check(){
  count=`ps -ef |grep $1 |grep -v "grep" |wc -l`

  if [ 0 -ne $count ];then
    echo "Kill Electron"
    killall $1
  fi
}

check "Electron" && yarn start
