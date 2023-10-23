#!/bin/bash

# Substitua com o seu token de API do Heroku
HEROKU_API_TOKEN="ce3353f3-6139-4df5-bf61-e26ff8849681"

# Obter a URL do último backup
BACKUP_URL=$(curl -s -X GET -H "Authorization: Bearer $HEROKU_API_TOKEN" -H "Content-Type: application/json" "https://api.heroku.com/apps/$PROD_APP_NAME/pg-backups" | grep -o '"url":"[^"]*' | cut -d'"' -f4)

# Verificar se a URL foi obtida
if [ -z "$BACKUP_URL" ]; then
  echo "Erro: Não foi possível obter a URL do backup."
  exit 1
fi

# Restante do script...
