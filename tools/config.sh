currentBranch() {
  git branch | grep "*" | sed "s/* //"
}

safeMatchingEnvForBranch() {
  case $1 in
    "nna") env="nna";;
    "dev") env="dev";;
    "master") env="prod";;
    *) echo "none"
       exit ;;
  esac
  echo "$env"
}

gulp config --env $(safeMatchingEnvForBranch $(currentBranch))