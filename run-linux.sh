#!/bin/bash

pause() {
  read -p "Press [Enter] key to exit"
}

cd $(dirname $0)

npm run start