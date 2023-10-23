#!/bin/bash

# Não precisa carregar .env no Heroku, as variáveis de ambiente já estão configuradas
# export $(egrep -v '^#' .env | xargs)

# Passo 1: Backup (ajuste conforme necessário)
BACKUP_URL=$(heroku pg:backups:capture --app $PROD_APP_NAME --json | jq -r '.url')

# Verifique se a URL do backup foi obtida com sucesso
if [ -z "$BACKUP_URL" ]; then
  echo "Erro: Não foi possível obter a URL do backup."
  exit 1
fi

# Passo 2: Restauração em Develop (ajuste conforme necessário)
heroku pg:backups:restore $BACKUP_URL DATABASE_URL --app $DEV_APP_NAME --confirm $DEV_APP_NAME

# Passo 3: Restauração Local (ajuste conforme necessário)
curl -o latest.dump "$BACKUP_URL"
docker cp latest.dump $CONTAINER_ID_OR_NAME:/latest.dump
docker exec $CONTAINER_ID_OR_NAME pg_restore --verbose --clean --no-acl --no-owner -h localhost -U $DB_USER -d $DB_NAME /latest.dump

# Cleanup
rm latest.dump
