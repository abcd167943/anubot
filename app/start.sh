#!/bin/bash

set -e

build_server() {
    if [ -e anubot-server ]; then
        echo removing anubot-server
        rm anubot-server
    fi
    go build -o anubot-server anubot/cmd/api-server
}

watch_app_views() {
    babel --presets es2015,react --watch --out-dir lib/views src/views &
    BABEL_PID=$!
    echo babel started as pid $BABEL_PID
}

watch_app_styles() {
    node-sass --watch --output lib/styles src/styles &
    NODE_PID=$!
    echo node-stats started as pid $NODE_PID
}

build_app() {
    cp src/app.js lib/app.js
}

kill_watchers() {
    echo tearing down babel pid $BABEL_PID
    kill $BABEL_PID
    echo tearing down node-scss pid $NODE_PID
    kill $NODE_PID
}
trap kill_watchers EXIT

main() {
    echo -e "\033[1m\033[34mBuilding API Server\033[0m"
    build_server
    echo

    echo -e "\033[1m\033[34mWatching Application Views\033[0m"
    watch_app_views
    echo

    echo -e "\033[1m\033[34mWatching Application Styles\033[0m"
    watch_app_styles
    echo

    echo -e "\033[1m\033[34mBuilding Application\033[0m"
    build_app
    echo

    echo -e "\033[1m\033[34mStarting Application\033[0m"
    electron .
}

main
