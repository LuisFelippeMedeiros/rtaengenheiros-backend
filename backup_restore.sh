#!/bin/bash

# Substitua pelo URL do seu backup
BACKUP_URL=$(pg:backups:url --app $PROD_APP_NAME)

# Passo 2: Restauração em Develop (ajuste conforme necessário)
pg_restore --verbose --clean --no-acl --no-owner -h $DEV_SERVER -U $DEV_USERNAME -d $DEV_DATABASE "$BACKUP_URL"

# Passo 3: Restauração Local (ajuste conforme necessário)
curl -o latest.dump "$BACKUP_URL"
# docker cp latest.dump $CONTAINER_ID_OR_NAME:/latest.dump
# docker exec $CONTAINER_ID_OR_NAME pg_restore --verbose --clean --no-acl --no-owner -h localhost -U $DB_USER -d $DB_NAME /latest.dump

# Cleanup
rm latest.dump
