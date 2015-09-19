#!/bin/bash
# Deploy script for app

currentBranch() {
  git branch | grep "*" | sed "s/* //"
}

lastMsg() {
  git log -1 $1 --pretty=%B
}

safeMatchingChannelForBranch() {
  case $1 in
    "nna") channel="nna";;
    "dev") channel="dev";;
    "master") channel="production";;
    *) echo "none"
       exit ;;
  esac
  echo "$channel"
}

case $1 in
  "nna") branch="nna"
         channel="$1";;
  "dev") branch="dev"
         channel="$1";;
  "prod") branch="master"
          channel="production";;
  "") branch=$(currentBranch)
      channel=$(safeMatchingChannelForBranch $(currentBranch))
      if [ "$heroku_app" = "none" ]; then
        echo "No matching channel found"
        echo "Choose 'nna', 'dev' or 'prod' !"
        exit
      fi
      echo "No target env specified: safely deploying to channel $channel";;
  *) echo "Choose 'nna', 'dev' or 'prod' !"
     exit ;;
esac

echo "-- Publishing $branch app"
git checkout $branch

if [ "$?" = "0" ]; then
  echo "-- Pushing to GitHub"
  git push origin $branch

  if [ "$?" = "0" ]; then
    echo "-- Pushing app to Ionic Deploy Service"
    last_msg=$(lastMsg $branch)
    ionic upload --note "$last_msg" --deploy=$channel
  fi
fi