#!/bin/bash

# Carregar variáveis de ambiente
export $(egrep -v '^#' .env | xargs)

# Passo 1: Backup
heroku pg:backups:capture --app $PROD_APP_NAME
BACKUP_URL=$(heroku pg:backups:url --app $PROD_APP_NAME)

# Passo 2: Restauração em Develop
heroku pg:backups:restore $BACKUP_URL DATABASE_URL --app $DEV_APP_NAME --confirm $DEV_APP_NAME

# Passo 3: Restauração Local
curl -o latest.dump $BACKUP_URL

# Cleanup
rm latest.dump
