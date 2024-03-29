#!/bin/bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS: 
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

DB_CONTAINER_NAME="titanium-admin-mysql"

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  docker start $DB_CONTAINER_NAME
  echo "REMOTE Database container started"
  exit 0
fi

# instead of creating new, for now just exit early. This is to avoid the need to restore the database incase the env variables are wrong. If using db for the first time then comment out the next two lines:
echo "Could not find a REMOTE MYSQL database container. Please check your .env file and try again."
exit 0

# import env variables from .env
set -a
source .env

DB_PASSWORD=$(echo $REMOTE_DATABASE_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

if [ "$DB_PASSWORD" == "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set a password in the .env file and try again"
    exit 1
  fi
  DB_PASSWORD=$(openssl rand -base64 12)
  sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
fi

docker run --name $DB_CONTAINER_NAME -e MYSQL_ROOT_PASSWORD=$DB_PASSWORD -e MYSQL_DATABASE=titanium-admin -d -p 3306:3306 docker.io/mysql

echo "Database container was succesfuly created"


