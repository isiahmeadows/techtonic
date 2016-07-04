#!/usr/bin/env bash

. "${NVM_DIR}/nvm.sh" || exit $?

nvm use stable

eslint . || exit $?
coffeelint . || exit $?

nvm use ${TRAVIS_NODE_VERSION} || exit $?

set +e

case ${ENV} in
    node) mocha ;;
    chrome)
        sudo apt-get update
        sudo apt-get install -y libappindicator1 fonts-liberation
        wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
        sudo dpkg -i google-chrome*.deb
        export CHROME_BIN=/usr/bin/google-chrome
        karma start --browsers ChromeTravisCI
        ;;
    firefox*) karma start --browsers Firefox ;;
    *) echo "Unknown \${ENV}: ${ENV}"; exit 1 ;;
esac