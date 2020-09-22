# TFM_2020_Aventura_Conversacional
## Para probar la skill:
- Acceder a su Alexa developer console: https://developer.amazon.com/alexa/console/ask
- Crear una nueva skill Custom con los valores por defecto (lenguaje español y el template por defecto).
- Dar como nombre de invocación: expedicion salvamento.
- En el apartado "interaction model" ir a "JSON Editor". Aquí eliminar el contenido y copiar el contenido del fichero ['intents_es.json'](/adventure-game-skill/src/app/intents_es.json) de la carpeta "/adventure-game-skill/src/app/intents_es.json"
- Guardar los cambios.
- En el apartado "Endpoint" seleccionar la opcion "HTTPS".
- En "Default Region" introducir el link "https://expedicionsalvamento.com/alexa"
- En el desplegable seleccionar la opcion "My development endpoint is a subdomain of a domain that has a wildcard certificate..."
- Guardar los cambios.
- En la barra superior ir al apartado "Test" y probar la skill.


