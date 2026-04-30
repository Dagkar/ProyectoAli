Deploy recomendado

Railway

1. Sube la carpeta padre completa que contiene `backend/` y `PROYECTO ALI/` a un repositorio GitHub.
2. En Railway, crea un proyecto nuevo desde ese repositorio.
3. Railway detectara el `package.json` de la raiz y podra iniciar con `node backend/server.js`.
4. Agrega un volumen persistente y montalo en `/data`.
5. Configura estas variables en Railway:
	- `JWT_SECRET` = un valor largo y privado
	- `NODE_ENV` = `production`
	- `HOST` = `0.0.0.0`
	- `DATABASE_PATH` = `/data/database.db`
6. Despliega. El backend tambien servira el frontend estatico.

Notas

- La API queda en `/api`.
- El chequeo de salud queda en `/health`.
- Si no montas volumen persistente, SQLite se perdera al reiniciar o redesplegar.