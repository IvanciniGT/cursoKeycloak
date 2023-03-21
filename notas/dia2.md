# Keycloak

## Realm

Espacio independiente donde gestionar:
- Usuarios**
- Permisos
- Aplicaciones

El realm master es el que contiene el usuario administrador de KeyCloak
El él no voy a meter nada más.

# Clients

- Apliaciones que solicitan a Keycloud:
  - Información de un usuario
  - Autenticación...
 
# Roles

Conjunto de permisos que podemos aplicar a un usuario oa todos los usuarios de un grupo

# Grupos

Los grupos me permiten aplicar roles en masa a un conjunto de usuarios

# API REST De KeyCloak

POST https://54.78.246.198:8443/realms/master/protocol/openid-connect/token


# HTTP

Es un protocolo de comunicación. Se basa en un modelo PETICION-> RESPUESTA
HTTP Request y un HTTP Response

Tanto en el request como en el Response podemos mandar unos datos... y unos metadatos
                                                            BODY            HEADERS
                                                            
Cuando hacemos una petición, la hacemos contra una URL:

URL:        protocolo :// dominio-servidor  :   puerto      contexto - ruta - endpoint                       ?parametros

            https     :// 54.78.246.198     :   8443        /realms/master/protocol/openid-connect/token

# WEB?

Un servicio que se ofrece sobre internet... como email, iptv, vozip
Se basa en una arquitectura Cliente / servidor, que se comunican mediante protocolo http.

Cliente fijo: Navegador de internet (http+html) ->> REQUEST --> Servidor (servidor web: http)
                                                            < -- RESPONSE(html, css, ...) ---
En un momento dado nos planteamos comunicar otro tipo de programas más allá de navegadores con servidores.

Programas que además no estaban orienatdos a seres humanos.
En esas comunicaciones, usamos formatos más neutros de transmisión de información: XML, JSON

Y al igual que teníamos un protocolo especializado en el envío de ficheros HTML, puede tener sentido tener protocolos especializados en 
este tipo de comunicaciones (entre programas) y los formatos que usan.

XML  < - SOAP
JSON < - REST (Rest es un conjunto de restricciones en el uso del protocolo http)

Cuando un programa quiere datos de un servidor conectado a internet puede hacer uso de peticiones REST:

Al hacer la petición usamos uno de los métodos de petición definidos en el estandar HTTP:
- GET       Solicitar datos, que no provocan cambio en el servidor
- POST      Operaciónes que hacen cambio en el servidor: CREATE
- PUT       Operaciónes que hacen cambio en el servidor: UPDATE
- PATCH
- DELETE    Operaciónes que hacen cambio en el servidor: DELETE
- HEAD      Consultar si un recurso existe o no

Cuando realizamos una petición y obtengo una respuesta, como metadato de la respuesta se envía un código:
2??     EXITO
3??     REDIRECCIONES
4??     ERROR DE CLIENTE (al hacer la petición)
5??     ERROR DE SERVIDOR

En el body, mandamos realmente según el estandar HTTP bytes
Hay un metadat que se usa para indicar el formato de los datos que mandamos (cómo interpretar esa secuencia de bytes)
Content-Type: application/json


POST https://54.78.246.198:8443/realms/master/protocol/openid-connect/token


client_id=admin-cli
grant_type=password # Mecanismo de autenticación
username=admin
password=password

Esos datos se los vamos a mandar el formato: FORMULARIO ... por qué?
Como headers no irían bien? Van en crudo... problemon (MAN IN THE MIDDLE)
JSON, FORM


POST https://54.78.246.198:8443/admin/realms

Le mandamos un JSON
{
    "id": "prueba2"
    "name": "Segunda prueba"
}

El access token lo mandamos como una cabecera HTTP:
Autorization: bearer <ACCESSTOKEN>


---

# Proxy                                       Cliente de LDAP 
Protege es un cliente                                v
                                                    LDAP            PostgreSQL      Servidor de Email
# Proxy reverso                                                             ^
Proteger un backend                                             KeyCloak1       KeyCloak2   
                                                                    ^           ^
                                                                 nginx (proxy reverso y balanceador)
                                                                    ^
                                                                Oauth2Proxy (Juguete)      NGINX
Cliente Persona     ----> Proxy     ------> Internet --------> Proxy reverso -----------> Servidor Web www.miempresa.com
PC- Navegador               www.miempresa.com                   Enrutamiento / Balanceador de carga
www.miempresa.com