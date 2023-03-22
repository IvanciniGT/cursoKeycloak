
LDAP
|-EMPRESA
|   |-DptoContabilidad
|       |-Menchu
|           |-MenchuPC
|-CLIENTES
|-PROVEEDORES


Cada componente que metemos en un LDAP se IDENTIFICA por su distinguised name
Cada elemento tiene atributos.

Cuando creamos un elemento dentro de un LDAP podemos usar una plantilla, que nos aporta un conjunto de atributos por defecto

username                        dn (puede cambiar) < 1 - porque cambien mi cn
 |                              |                    2 - porque cambien el cn de uno de mis padres
 v                              v
KeyCloak ---id interno ldap---> LDAP (entryUUID)
          Datos que cambian de un usuario en KeyCloak, los quiero llevar al LDAP
         < --------------------
          Datos que han cambiado en el LDAP me los quiero traer a KeyCloak

Esa comunicación siempre la arranca el KeyCloak.
- Cuando KeyCloak cambia algo, él sabe que lo ha cambiado... y lo puede llevar al LDAP (si así lo he solicitado)
- Cuando algo cambia en el LDAP, él NO SABE que ha cambiado... y por ende, no lo va a traer.
    Lo traerá solo si:
        1. Fuerzo a que un dato siempre se lea del LDAP (PENSALIZA EL RNTO)
        2. Porque refresce mis datos con una determinada periodicidad (CRONJOB)
            Si pongo que refresque (sincronice) cada poco tiempo... DATOS MAS GUAYS
                                                                    MUCHOS MAS RECURSOS 

Por qué querria traerme los usuarios de LDAP a KeyCloak?
- Rendimiento
- Añadir información adicional a los usuarios, información que no está en el LDAP, pero que desde KeyCloak nos hace falta
    - Atributos
    - Grupos
    - Roles
    - Credenciales
    - Cuentas vinculadas (Github, Gitlab, facebook...)

---
Usos de Keycloak:
- Identificacion
- Autenticacion
- Autorizacion

---
Mapper < Mapeador

Una función que mapea (asigna) un valor a otro. Vincula atributos
Los usamos en:
    - Proveedores de identidad
    - Federación de usuarios
    - Scopes de nuestros clientes

En el LDAP usamos los mapper para VINCULAR ATRIBUTOS del LDAP a atributos de la BBDD interna de KeyCloak

MAPEADOR: VincularTelefonoDelLDAP

    ORIGEN -----> DESTINO
    KeyCloak        Token acceso
                    Token de ID
    ** Este es el caso que usaremos en los clientes !
    
    En KeyCloak los usuarios tienen un atributo llamado "phone"
    Ahora quiero montar una aplicativo que use el número de teléfono.
        - Donde se configura esto?          KeyCloak > Client Scope > Mappers
        - Quién ha configurado ESTO???      - Puede ser que el administrador del KeyCloud exporte esos datos con unos nombres concretos
                                            - Puede ser que desarrollo monte en KeyCloud, para su aplicativo

    ORIGEN -----> DESTINO
    Github                                  Token acceso en KeyCloud
    Gitlab                                      Consumido por la app
    Facebook                                    Entrarán los datos que manda facebook,....
                                                    Puede pasar que algunos datos de github no los exponga
                                                    O le cambio el nombre a algunos
    TOKEN DE ACCESO                             Más los datos que yo tengo en KeyCloak
    Se usa para Identificar/Autenticar
    
    ** Este es el caso que usaremos en los clientes !


    App1, que necesita el teléfono
    App2, que necesita el teléfono
    
    
    DATO (En A) <------> Dato (En B)
    
    ** Este es el caso de nuestro LDAP
    mobile en LDAP <------> phone en KeyCloak
        - Donde se configura esto?          KeyCloak > Federación de usuarios > LDAP
        - Quién ha configurado ESTO???      Administrador de KeyCloak
    
    
    
    

----

Discoteca:
- Para entrar pongo un portero -> aplicación

KeyCloud? Policia Nacional, qué es quien expide el token

Identifiación/Autenticacion? DNI -> TOKEN ACCESO

Qué viene en ese token de acceso? DNI?
    - Numero del DNI        < ID único
    - Nombre                < ID 
    - Foto                  < Foto : RECONOCIMIENTO FACIAL (contraseña)
    - Fecha nacimiento      < Atributo
    
El DNI es algo fijo... invariante! y trae los datos que trae... que son fijos... 10 datos.

Imaginad que necesito el teléfono de una persona que entra en mi discoteca.
Qué hago?
- Portero (nuestra aplicación) lo pide al USUARIO. YA ME ESTOY COMIENDO UN MONTON DE CURRO
- Pedir que el DNI incluya el teléfono... aquí ya no me encargo yo el tema!

    Evidentemente esto es algo que no puedo hacer con los DNIs
    Pero si con KeyCloak: SCOPE !
        scope: "dni básico" con solo fecha nacimiento
        scope: "dni-avanzando" que incluye telefono

Quién define eso?
- El aplicativo es el que TIENE UNA NECESIDAD DE DATOS !
    Y en ocasiones configuro YO COMO APLICATIVO un scope con los datos que me interesan
        TE dan clave para que netres a la web del KeyCloak
        TE Montan un proceso en Jenkins para que metas 4 datos en un formulario y se de de alta en AUTOM (API REST ADMIN)
            v
            Pero en el entorno de preproduccion -> PASO A PROD es autom de esde ese entorno
- El administrador me haya creado una serie de SCOPES que exporten los datos de los que tiene constancia (que gestiona)
    Y en ocasiones YO ME AMOLDO a usar un scope que ya incluya los datos que necesito

El usuario autoriza a un aplicativo a acceder a los datos que solicita (scope)


----
En muchos mapeadores trabajamos con JSONPath

Github te pasa un access_token
{
  "exp": 1679447752,
  "iat": 1679447452,
  "auth_time": 1679445853,
  "jti": "a65e12cd-deb9-44c6-9aa8-b1e90ea07527",
  "iss": "https://3.253.29.47:8443/realms/prueba",
  "aud": "account",
  "sub": "dbb43902-1f6e-45e6-98d8-ce5bae09b09b",
  "typ": "Bearer",
  "azp": "react",
  "nonce": "0d837d14-8ead-418e-83ab-f2e977a4d253",
  "session_state": "dc05abd2-6bc2-4818-98c4-d207583f42b2",
  "acr": "0",
  "allowed-origins": [
    "*"
  ],
  "realm_access": {
    "roles": [
      "default-roles-prueba",
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid profile email",
  "sid": "dc05abd2-6bc2-4818-98c4-d207583f42b2",
  "email_verified": true,
  "name": "Ivan Osuna",
  "preferred_username": "ivancinigt",
  "given_name": "Ivan",
  "family_name": "Osuna",
  "email": "ivan.osuna.ayuste@gmail.com",
  "phone": "9278479227"
}
---

# JSON

Notación de Objetos en el lenguaje de programación JavaScript

var numero=7            // STATEMENT
    - 7                 ---> Meter el dato(objeto) 7 en memoria RAM. De que tipo es? numeric
    - var numero        ---> Define una variable llamada "numero"
    - =                 ---> Asigna la variable al número
    
    numero = 14
    - 14                ---> Meter el número 14 en memoria RAM. DONDE???? En el mismo sitio que está el 7? En otro sitio
                            Y en este momento en memoria cuantas cosas tengo? 2, el 7 y el 14... En sitios distintos
    - numero =          ---> Hace la variable "numero" deje de apuntar al valor 7 y pase a apuntar al valor 14
                                Y el valor 7 se queda huerfano... GARGABE < - Que será eliminada por el GC
                            
                                En JAVA tenemos GC?     SI
                                En JS tenemos GC?       SI
                                Y en C?                 NO
                                    Y en C, esa linea habría escrito el 14 donde estaba el 7.. o al menos podría haberlo
                                    conseguido.... C trabaja a más bajo nivel y tiene acceso a posiciones de memoria (PUNTEROS)
                                JAVA o JS son lenguajes que HACEN UN DESASTRE en la memoria RAM < ES COMODO. 
                                    Desarrollo más rápido y hay MENOS probabilidad de un memory leak
                                    Esto es bueno o malo? Ni bueno ni malo... ES UNA FEATURE !!!

var texto="hola"
var logico=true
var objeto={
    "nombre": "Ivan",
    "edad": 44
}
var lista=[1,2,3];
---
4           SI ESTO ES JSON VALIDO
---
[
    {
        "nombre": "Ivan",
        "edad": 44
    },
    {
        "nombre": "Ivan",
        "edad": 44
    }
]
---
{
    "nombre": "Ivan",
    "edad": 44
}

---
JSON

Lo usamos como lenguaje estandar para transmisión / estructuración de información.
Pero no es el único: XML, YAML
XML es muy anterior a JSON
De hecho XML, HTML vienen de un lenguaje mucho más antiguo SGML

XML Es un estandar del W3C

<usuario>
    <nombre>Ivan</nombre>
    <edad>44</edad>
</usuario>

Cuando nace, existía (heredado de SGML) un concepto llamado DTD: Document Type Definition
Donde se indicaba la estructura de marcas que debía tener un documento

Más adelante en XML surge el concepto de SCHEMA

El esquema también permite definir la estructura de un documento (la secuencia concreta de TAGS)
Pero en los esquemas se mete la posibilidad de dar TIPOS DE DATOS.
Esto es optro estandar del W3C

En JSON se imita el concepto de Esquema de XML -> JSON Schemas

Con las misma, en XML nos dan también en un momento dado un lenguaje que sirve para EXTRAR/IDENFICAR datos concretos de un documento XML
Eso se llama XPATH   //nombre               /usuario/nombre

En JSON se hace lo mismo... copiado de XML. JSONPath
Que me permite acceder a datos concretos de un JSON

De JSONPath NO HAY UN ESTANDAR... hay diretrices... que cada aplicativo implementa como le viene bien
{
    "nombre": "Ivan",
    "edad": 44,
    "padres":{
        "padre": {
            "nombre": "Isidoro"
        }
        "madre": {
            "nombre": "Maria de los Angeles"
        }
    }
}

$.padres..nombre




----

APLICATIVO 
    - Aplicacion web
    - Aplicacion Smatphone
    - Servicio Backend
    
    Y esa app lanza un request contra un Servicio REST * Esto es lo que hacemos al usar KeyCloak

Dos SISTEMAS

El mio -----> El otro (en este caso de este curso: KeyCloaK)

Quiero que esos 2 componentes estén débilmente ACOPLADOS !

El otro, manda un JSON que contiene:
{
    "nombre": "Ivan",
    "edad": 44,
    "padres":{
        "padre": {
            "nombre": "Isidoro"
        }
        "madre": {
            "nombre": "Maria de los Angeles"
        }
    }
}

En el MIO, leo ese JSON --> Extraigo unos datos y los meto en algunas variables/objetos de MI SISTEMA
Y el springboot hace magia (nos regala un mapeador automático)

Clase: USUARIO
    String nombre
    int edad
    PADRES padres

Clase: PADRES
    PADRE padre
    MADRE madre
    
Clase PADRE
    String nombre
    int edad

Clase MADRE
    String nombre
    int edad

Dentro de un año, los del OTRO deciden cambiar el JSON que mandan.
{
    "nombre": "Ivan",
    "edad": 44,
    "progenitores":{
        "padre": {
            "nombre": "Isidoro"
        }
        "madre": {
            "nombre": "Maria de los Angeles"
        }
    }
}
Al cambiar esto,... que ocurre con el MIO???
PETA DE COJONES !!!!!

Y que hago? Cambio las clases JAVA... y que impacto puede tener ese cambio? 
Porque a lo mejor tengo que cambiar medio proyecto.
Y otros proyectos que usan también esas clases.
O esas clases se usan para exportar datos mediante JSON a otros servicios o consumnidores.

NUNCA HACEMOS ESTO. Montamos un ADAPTADOR

En mi programa, monto lo primero un filtro (mapeador) que transforma SU JSON en lo QUE YO QUIERO.

----

# Politicas de las contraseñas.

Se asignan a nivel de REALM.
- FORZAR MAYUSCULAS
- FORZAR MINUSCULAS
- CARACTERES ESPECIALES
- LONGITUD
- NUMEROS
- REPETICION -> Vamos guardando las huellas anteriores. 
    Pero puede darse el caso que una contraseña que no he usado, me diga que si... por las colisiones.


- Si puede contener el nombre
- Podemos tener una lista negra de contraseñas. password Pa$$w0rd P455w0rd
- Si voy a guardar una huella? algotirmo con el que la genero

Cómo guarda la contraseña KeyCloak en su BBDD? POSTGRESQL?
La guarda encriptada? NO
Lo que guardamos es una huella. Por qué? Si me roban la BBDD siguen sin tener acceso a la contraseña. Solo a la huella
Desde la huella es posible regenerar la contraseña? NO
Puede haber varias contraseñas incluso que den la misma huella
Eso sería fuerza bruta.... Bueno... tenemos hoy en día computadooras muy potentes
Estoy tranquilo guardando solo una huella de la contraseña? 
    Y si guardo una huella de la huella?

El tema de la seguridad SOLO ES CUESTION DE CONFIANZAS !
Cuándo estoy tranquilo.

---

Tengo 2 apps

Comparten usuarios? 
SI si los comparten, pueden ir en el mismo REALM o NO... pero entonces tengo que duplicar los usuarios
Lo puedo poner en 1 realm o en 2...?
Habría manera de que un realm lea los usuarios de otro? Si están en un ldap.
Incluso, si están en 2 realm, aunque se guarden por abajo en el mismo LDAP,

SI NO.... lo meto en 2 REALMS distintos 
    cada uno puede tener su propia politica de contraseñas
    Pero todos guardados en el mismo LDAP
    
---
En algunos casos, vamos a tener varios LDAP
- Tengo un LDAP de personal interno < Lleve su gestión independiente
- Tengo un LDAP publico             < La gente se puedde registrar


Microservicio debe poder ser utilizado tanto por gente interna como externa

Compañía: BANCO
Microservicio para conocer el saldo de una cuenta

Querrás el microservicio darlo de alta UNA VEZ, como un cliente... dentro de un único REALM
Y trabajo contra 2 LDAP

...

En general nos interesa almacenar por detrás los datos en un LDAP?

Decisiones....
El inconveniente de guardar los usaurios publicos SOLO en KeyCloak.
- Solo se pueden usar desde aquí.
- Hay otro motivo de decisión OCULTO a priori... pero que el día de mañana nos puede matar.
    QUE EN UN MOMENTO QUIERA QUITAR EL KEYCLOAK Y METER OTRO GESTOR DE IDENTIDADES.
Abre proyecto de migración... que puede ser sencillo o no!

...

Un usuario accede a nuestra aplicacion1 (JS)... qué pasa ahí?

USUARIO         NAVEGADOR           WEBAPP (JS)             KEYCLOAK            BACKEND Servicios                                   SERVIDOR WEB
escribe una URL1 --------------------------------------------------------------------------------------------------------------->   Qué entrega? UN HTML y un huevo de JS
                RUTA: URL1
                muestra el HTML 
                ejecuta la app
                --------------------> Generar Más HTML
                < ------------------
                pulsa un botón...
                pulsa un enlace ---> Ejecución de un código
                                    y en un momento queremos hacer algo que requiera de autenticación 
                                        Necesita AUTENTICACION... y no la tengo... Y ADEMAS, la app web saber que el usuario tiene el pertinente ROLE
                                    Se lanza un redirect al navegador 3XX:
                                        se añade información del CLIENTE (MI WEBAPP)
                                        se añade información de REDIRECT (1)
******
    
                REDIRECT del codigo JS                                                                                          AUTENTICACION
                RUTA: URL KEYCLOAK
                    https://mikeycloak/realm/prueba/token? QUE SOY LA WEBAPP DE NOMINAS !!!!
                                                            Y COMO COÑO SABE EL KEYCLOAK QUE REALMENTE ESTO LO PIDE LA APP DE NOMINAS????
                                                            Distintas formas: ORIGEN PERMITIDO: CORS URL1 deberás de estar entre las permitidas (origin)
                                                            Devuelve la pagina de login
                Muestra la página de login  --------------> FELIPE
                                                            Debe emitir un token para felipe
                                                            pero en ese token, tiene que meter los datos de un SCOPE
                                                            Y Felipe quizás NO HA DADO SU CONSENTIMIENTO para ello
                                                            Le manda una pantalla de consentimiento (autorización del scope)
                Que si estamos de acuerdo con ello
                    SI  ------------------------------------>EMITE TOKEN
                                                                        si tiene lo que hay que tener (ROLES, GRUPOS...)        AUTORIZACION BASICA
                < ------------------------------------------ OTRO REDIRECT (3XX) SE LANZA a donde? a la app web (JS) a donde se haya dicho en (1)
                                                                siempre y cuando? sea un redirect VALIDO según se haya configurado en el REDIRECT DEL CLIENT DE KEYCLOAK
******
    
                RUTA: URL3(que es del webapp)... pero protegida
                muestra el HTML 
                ejecuta la app
                --------------------> Generar Más HTML
                                      Detecto que ya tengo token.
                                      Extraigo los datos que necesito... y a jugar. (telefono, email, nombre, roles.)           PREFILTRADO DE OPERACIONES? Quien la hace? Webapp (JS)
                                        Si tiene los roles adecuacos para una operación: Le saco el botón                                
                                        Si no tiene los roles... pues no le saco el botón    
                < ------
                HTML CON BOTON COJONUDO PARA CREAR EL MUNDO !!!!!!
    Apreta el botón rojo------------->
                                        PETICION DE CREACION DE MUNDO !!!
                                        ----En esa petición? ------------------>
                                            Mandar el token
                                                                                QUIERE PROTEGERSE DEL USUARIO y DEL WEBAPP      
                                                                                Identificar/Autenticar... ¿Cómo lo hace?
                                                                                    OFFLINE
                                                                                        Miro que el token venga del Keycloak que yo conozco
                                                                                        Y que no esté caducado
                                                                                    ONLINE
                                                            < -------------------------- Le pregunto a Keycloak si ese token es válido (a lo mejor se ha denegado/cancelado)
                                                                                         Client-id (esta es otra app) y mi secret
                                                            Qué hace Keycloud lo primero?
                                                            Al backend: Y tú quién eres?
                                                            Comprobar la firma?
                                                            Y compararlo con el token que él tiene guardado como válido
                                                            ------------------> SI ES FELIPE !!!!!
                                                                                 Qué quieres FELIPE? A crear el mundo!
                                                                                Crear el mundo???? Vamos a verlo: AUTORIZARLO
                                                                                 El backend mira los roles... y más cositas que tenga que mirar y decide
                                                                                                                                AUTORIZACION ? ES EL BACK 
                                                                                                                                Uso el keycloak para IDENTIFICACION y AUTENTICACION
                                        
                                        
USUARIO         NAVEGADOR           WEBAPP (JS)             KEYCLOAK            BACKEND Servicios                                   SERVIDOR WEB

Keycloud también se puede usar para AUTORIZAR. Esto nos sirve para casos sencillos (que tenga unos roles, que esté en unos grupos)

Hay apps que llevan un control más ferreo. Puede editar un recurso (expediente) ... pero solo estos 3 expedientes.
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        