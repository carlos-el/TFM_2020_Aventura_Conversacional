# TFM_2020_Aventura_Conversacional
## Para probar la skill:
### 1. Levantar la skill:
- Clonar el repositorio en su entorno local.
- Ejecutar el Docker Compose del directorio raíz del proyecto.
- Con una herramienta como, por ejemplo, [ngrok](https://www.npmjs.com/package/ngrok) hacer una pasarela que publique el puerto de la skill (en nuestro caso el 3000).

### 2. Publicar las skill en la consola de desarrollo de Alexa:
- Acceder a su Alexa developer console: https://developer.amazon.com/alexa/console/ask
- Crear una nueva skill Custom con los valores por defecto (lenguaje español y el template por defecto).
- Dar como nombre de invocación: expedicion salvamento.
- En el apartado "interaction model" ir a "JSON Editor". Aquí eliminar el contenido y copiar el contenido del fichero [intents_es.json](/adventure-game-skill/src/app/intents_es.json).
- Guardar los cambios.
- En el apartado "Endpoint" seleccionar la opcion "HTTPS".
- En "Default Region" introducir la dirección donde esta disponible el servicio (en nuestro caso de ejemplo, el enlace publicado por ngrok).
- En el desplegable seleccionar la opcion "My development endpoint is a subdomain of a domain that has a wildcard certificate..."
- Guardar los cambios.
- En la barra superior ir al apartado "Test" y probar la skill.


