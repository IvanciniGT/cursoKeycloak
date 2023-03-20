
# Keycloak

Herramienta de software OPENSOURCE + GRATUITA(FREEWARE) -> FREE SOFTWARE, principalmente impulsada por REDHAT.

REDHAT es una compañía de software que aplica siempre la misma política a sus desarrollos:
De cada producto que fabrican, ofrecen 2 distribuciones:
- Opensource y gratuita
- Opensource y de pago (basada en un modlo de subscripción)

Productos que fabrica REDHAT:
- RHEL                              <- upstream - fedora
- Openshift Container Platform      <- upstream - OKD
- Jboss                             <- upstream - wildfly
- Ansible Tower                     <- upstream - AWX
...
- Redhat SSO                        <- upstream - Keycloak

Características:
- Proveedor de identidad
- Soporta varias fuentes de usuarios. Federación de usuarios:
    - Podemos tener los usaurios almacenados en la BBDD propia de KeyCloak
    - Podemos tener los usuarios almacenados en un LDAP
    - Podemos tener los usuarios almacenados en un Active Directory
- Permite definir recursos, para configurar accesos
- Gestión de roles
- Autenticación con proveedores externos. Identity broker:
    - Puede usar servicios de autenticación externos:
        - Google
        - Facebook
        - Github
        - OpenID Connect
- API REST para todas las operación de administración y gestión
- SSO.
    Tener un sitio centralizado donde poder hacer login, logout para todas mis apps
- Apto para entornos de producción:
    - Alta disponibilidad
    - Escalabilidad
- Multiteniente (multitenance)
    Con una UNICA INSTALACION y EJECUCION podemos estar gestionando multiples conjuntos de datos de forma independiente
    En nuestro caso:
    - Podemos gestioar usuarios, autenticaciones... para multiples clientes
                                                    para multiples proyectos.
      Cada uno/(a) con sus propios usuarios/datos

---
# OpenID Connect

Protocolo de autenticación basado OAuth2

# OAuth2

Protocolo de autenticación de usuarios.
Lleva (transporta) datos de los usuarios para compartirlos conotras apps.
- Ciertos datos asociados a mi cuenta: email, nombre, telefono, contactos, roles,...

También lleva capacidad para Autorización y notificación de eventos.
---

# SSO: Single Sign ON

Los usuarios de aplciaciones (o aplicaciones en si mismas) se autentican contra un sistema de SSO centralizado (o descentralizado)...
De forma que ese sistema generará una especie de "certificado" avalando la identidad de esa persona.

# Autenticación

Verificar la identidad de un ente (usuario, aplciación...): USUARIO = IDENTIDAD

Se puede realizar de varias formas diferentes:
- Contraseña (peliculas de espías... el rio está muy alto.... porque ha llovido mucho)
- Características biométricas (huella, reconocimiento facial)
- Certificado (DNI, Carné de conducir) <- GRACIA? 
  Ese certificado está emitido por una entidad CERTIFICADORA de confianza: Policia Nacional, Trafico...
  Entra el concepto de Cadenas de confianza de Entidades Certificadoras
---

# Autorización

Como controlamos el acceso a los recursos en base a los privilegios que un usuario tiene asignados.

Para tener autorización, normalmente lo primero es Autenticar.

Comparto una carpeta en google drive... quiero compartirla. Qué opciones tengo?
- Cualquier persona que tenga el enlace < La autorización se hace en cuanto la persona tiene el enlace.
    Equivalente a compartir un PDF en internet en abierto, pero el pdf pide contraseña.
- A personas concretas < Lo primero que necesito es AUTENTICAR a la persona.

---

# Repudio

Rechazar la autoriza de una acción.
Puede haber alguien que quiera rechazar la autoria de una acción. 

¿Qué puedo hacer para evitar que alguien repidie una acción?
AUTENTICACION -> Dejo una evidencia de la autoria del acto (FIRMA)

---

Cuando me conecto por https a un sitio WEB:
¿Cuántas autenticaciones se hacen en esta transacción? 2
Iván -> Amazon, para hacer un pedido.
- Iván comprueba, que el servidor con el que está hablando es el de Amazon.     Certificado que amazon presenta
    Identidad: amazon.es (1)  

- Amazon comprueba que yo soy Iván:                                             Contraseña
    Identidad: Iván                                                                 Esa contraseña, la conocen sólo Amazon e Iván

Qué hay dentro de ese certificado que amazón presenta?
    Id
    ----
    Nombre: amazon.es (2)       |
    Clave pública de Amazón     |   Le aplico un algoritmo de huella (HASH) -> NUMERO (más o menos representativo del valor original)
    Fecha caducidad             |
    ----
    Nombre de la Entidad Certificadora: FNMT
    Clave pública de la CA
    Algo que nos asegure que REALMENTE este certificado ha sido emitido por esa entidad certificadora... y no por mi en casa (COPIA BARATA):
        Firma de la entidad certificadora... se puede también falsificar? He de evitarlo... he de ponerlo complicado.
        ...Esa huella es encriptada por la entidad certificadora, usando su clave PRIVADA

Qué hace Iván al recibir el certificado?
- Hago hash de los mismos datos que lo ha hecho la CA... de los que vienen en el certificado
- Desencripto el HASH que vienen encriptado con la clave privada de la CA (ya que tengo la clave pública)
- Y miro si son iguales.
- Si son iguales? 
    - Tengo garantía de que los datos no se han modificado? No absoluta... está limitada por El número de colisiones del algoritmo de hash
    - Si ahora miro la identidad de la persona que yo conozco (1) y el dato que viene en el certificado (2) y coninciden... 
        Acepto que estoy hablando con amazon.es y no con otro ente = He verificado la identidad de amazon. 
--- 
HTTPs= HTTP + TLS

Esta capa, nos ayuda a evitar(MAL: FRUSTRAR) 2 tipos de ataques:
 - A lo mejor amazon.es no es amazon.es... y es otro... Que se ha puesto la careta de Amazon (como en misión imposible)
    ATAQUE DE PHISING = Suplantación de IDENTIDAD . Es tan sencillo como cambiar mi DNS
    Puedo evitar un ataque de Suplantación de identidad? NO. lo puedo frustrar
 - A lo mejor alguien se pone a espiar la comunicación: MAN IN THE MIDDLE
    Este tipo de ataques, tampoco es evitable.
    Lo que hacemos es ENCRIPTAR el mensaje que mando. De forma que lo que alguien pueda escuchar (espiar) es inutil... No sirve. No saben lo que hay ahí realmente

En HTTPs qué se usa para encriptar? algoritmos simétricos o asimétricos?
En ambos.
- El grueso de la comunicación se hace mediante algoritmos SIMETRICOS -> MAS EFICIENTES
- Se usa un algoritmo asimétrico para compartir la clave simétrica.
La clave simétrica se genera para cada par de interlocutores y se regenera cada cierto tiempo.

---

# Algoritmos de encripción:

Programa que recibe una secuencia de bytes, y devuelve otra secuencia de bytes, totalmente distinta... pero...
Tengo garantías de que:
- La misma entrada me devuelve siempre la misma salida(cuando aplico el mismo algoritmo y con la misma parametrización)
- Puedo volver al mensaje original, aplicando el mismo u otro algoritmo (o el mismo algoritmo con distinta parametrización)

Hay 2 tipos de algoritmos de encripción:
- Simétricos: Tengo solo 1 clave que se usa para: ENCRIPTAR y DESENCRIPTAR
- Asimétricos: Tengo 2 claves... que se generan conjuntamente de forma que:
    - Una clave sirve para ENCRIPTAR        <- Privada
    - Una clave que sirve para DESENCRIPTAR <- Pública
    - A cada clave PRIVADA le corresponde una UNICA clave PUBLICA

Algoritmos siméticos:
- Ventajas:         Más eficientes computacionalmente que los asimétricos
- Inconvenientes:   Nivel de seguridad más bajo... debido a qué en algún momento del tiempo se ha compartido la clave
                    Susceptibles de fuerza bruta.
Algoritmos asimétricos:
- Ventajas          Solo se comparte la clave con la que desencripta (la PUBLICA)... la priva NUNCA SE EXPONE. No ha habido un momento donde se comparta 
- Inconvenientes:   Menos eficientes computacionalmente que los simétricos
                    Susceptibles de fuerza bruta.


---
SHA o MD5: Algoritmos de Hash.... Algoritmos de HUELLA

Qué es un algoritmo de HASH o de HUELLA?
Es un programa (función) que siempre devuelve el mismo valor, cuando recibe la misma entrada.
Habitualmente, el valor devuelto es DE MENOR TAMAÑO que el valor de entrada... aunque no siempre.
No tengo garantías de que 2 entradas diferentes conduzcan al mismo valor devuelto... Puede ocurrir (colisión)
Cada algoritmo que uso tiene una determinada frecuencia de colisión.

LETRA DEL DNI: Se genera mediante un algoritmo de huella:

23.000.001 -> Divido el número entre 23 
              Me quedo con el resto de la división: Estará entre 0-22
              El ministerio de Interior tiene publicada una tabla que asigna a cada uno de esos números, una letra
                En nuestro caso, le toca la R < - 'R' es una huella del número 23000001, al aplicarle el algoritmo que publica el Ministerio de Interior
              
              23005 | 23
             -23    --------
               00     1000
                00
                 05 < - RESTO
    
              El algoritmo es público... y por tanto, reproducible por cualquiera.

Tengo garantía de que 2 números no generan la misma letra? NO... Hay muchas colisiones en este algoritmo:
                                                                 Hay muchos números que generan la misma letra (la misma huella)
                                                                 En este caso, 1/23 es la probabilidad de que otro DNI tenga mi misma letra < - PORCENTAJE DE COLISION

Si tengo garantía de que siempre que aplico este algoritmo al mismo número, siempre obtengo la misma letra.

Para que se usa?
- Transportar datos seguros? NO... ya que no tengo ni el dato.
- Para validar que el dato no se haya MODIFICADO, EQUIVOCADO... tengo total garantía? La de la colisión.
---

# Opensource?

Codigo abierto. Que se puede acceder al código = GRATIS? No tiene por qué.

---

# Instalación:

KeyCloak
BBDD para KeyCloak
LDAP
Apps de ejemplo:
    Backend: miscorservicios (springboot)
    FrontEnd: Autenticación.

De cara a hacer las instalaciones vamos a usar CONTENEDORES.

De hecho la forma recomendada de instalar hoy en día KeyCloak (y en general cualquier sistema) es mediante contenedores.

---

# Contenedores

Es un entorno aislado dentro de unn SO con kernel Linux donde correr procesos.

Entorno aislado:
- Entorno que tiene su propia configuración de red -> sus propias IPs. IP de qué red? De una red virtual que crea docker en nuestro caso.


    ----------- Red de mi empresa ----------------
        |                                       |
        172.31.30.43                            ????
        |           :8080-> 172.17.0.2:80       |
        IvanPC NAT(redirección de puertos)      MenchuPC
        |
        172.17.0.1
        | 
        |- 172.17.0.2 - Contenedor de nginx :80
        |
        Red de docker

- Entorno que tiene sus propias variables de entorno
- Entorno que tiene su propio sistema de archivos
- Entorno que puede tener restricciones de acceso al Hardware del host

Los contenedores los creamos desde IMAGENES de contenedor

x Máquinas virtuales por capas reutilizables, donde el SO se reutiliza entre los contenedores
x Una manera de exportar apps de forma estandar -> Eso lo son las IMAGENES DE CONTENEDOR


Quién opera hoy en día los entornos de producción de las empresas? No hay nadie (perona) detrás de un entorno de producción
                                                                   Lo que hay es un programa que es quien OPERA el entorno de producción: KUBERNETES
                                                                   
                                                                   Kubernetes se ofrece en forma de distribuciones; K8S, K3S, Openshift, Tamzu...
                                                                   
# Imagen de contenedor

Una imagen de contenedor es un triste fichero comprimido (tar) que dentro SUELE contener comprimido
una estructura de carpetas compatible (según estandar POSIX):
/bin            Comandos ejecutables
/opt            Programas
/etc            Configuraciones
/tmp            Temporales
/var            Datos de los programas (log, tablas de una BBDD...)
/sbin       
/home           carpetas de usuario
/boot
/media
...

Y dentro de esas carpetas, INSTALADOS un monton de programas... con sus respectivos archivos de conf... y otros.

Todo eso lo meto en un ZIP (tar) -> IMAGEN DE CONTENEDOR al canto.

Las imágenes de contenedor además llevas una serie de metadatos:
- Quien es el autor
- Que puertos abren los procesos que dentro corren (cuando se genere un contenedor desde esta imagen)
- En qué carpetas guardan los datos los proc que dentro corren... (cuando se genere un contenedor desde esta imagen)
- Cuál es el programa principal (comando) que debe ponerse en marcha cuando se arranque un contenedor creado desde esta imagen.

El PUNTO IMPORTANTE Es que una imagen de contenedor... tiene dentro PROGRAMAS YA INSTALADOS DE ANTEMANO POR ALGUIEN... 
que habitualmente sabe del programa 50 veces más que yo.

Quiero montar PostgreSQL en mi computadora... qué hago normalmente?
1- Descargar el programa? Descargar un INSTALADOR del programa.
2- Ejecuto el instalador... y ahí tendre que poner un montón o no (depende del programa) de datos de configuración
3- Ejecuto el programa YA INSTALADO.

-> c:\Archivos de programa\postgre -> ZIP ->  email 

Las imagenes de contenedor las encontramos en Un registry de repositorios de imagenes de contenedor:
- Docker hub
- Quay.io       <- Registry de REDHAT

---

Para operar con contenedores necesitamos: DE UN GESTOR DE CONTENDORES:
- Docker
- Podman
- Crio
- ContainerD

Dentro de un contenedor tendré MUCHOS procesos corriendo (o 1)
Siempre puedo abrir nuevos procesos dentro de un contenedor:
$ docker exec CONTENEDOR COMANDO
---

Hemos visto que los contenedores tienen sus propias variables de entorno
Hemos visto que los contenedores tienen su propia red e IPs
Hemos visto que los contenedores tienen su propio FileSystem

Pero no sabemos una cosa que necesitamos de ese sistema de archivos:
El sistema de archivos de un contenedor está montado por la superposición de varias CAPAS.

    CAPAS ADICIONALES: VOLUMENES
        Esas capas realmente no están guardadas dentro del contenedor sino externamente: HOST
    CAPA Contenedor: Todas las modificaciones sobre el FS de la imagen se hacen aqui, en esta capa.
    CAPA BASE: Capa de la imagen es inalterable
                Si hay que hacer algun cambio en el Sistema de Archivos aquin no se puede hacer

HOST
    /
        bin/
            ls 
            mkdir
        etc/
        var/
            lib/
                docker/
                        containers/
                                minginx1/
                                    var/
                                        log/
                                            nginx.log
                                minginx2/
                                    var/
                                        log/
                                            nginx.log
                        images/
                                nginx/ < ---- Le hago creer a los procesos de dentro del contenedor que la / es esta carpeta
                                    bin/
                                        sh
                                        ls
                                        mkdir
                                    etc/
                                        nginx/
                                            nginx.conf < - Configuración
                                    var/
                                    tmp/
                                    opt/    
                                        nginx/
                                            nginx < - Binario
        tmp/
        opt/
        home/
            ubuntu/
                environment/

Para que sirven los volumenes en los contenedores:
- No perder los datos tras el borrado de un contenedor
- Compartir datos entre contenedores
- Inyectar ficheros o carpetas de configuración al contenedor

## Cómo identificar una imagen de contenedor:

quay.io /  keycloak/keycloak  :21.0.1
            usuario/repo
registry / repositorio        :tag


El tag representa una IMAGEN concreta, que tendrá instalada una versión del software CONCRETA y algunos añadidos o características.
21.0.1
21.0.1-alpine
1.22.4-alpine-perl
En la mayor parte de los repos, encontrareis el tag: latest

En muchas ocasiones vereis que no incluimos info del registry... 
En esos casos, El gestor de contenedores tira de los registries configurados por defecto.

Por defecto, si no pongo tag, se busca el tag latest... que puede no existir

Qué opción veis más interesante para un entorno de producción:
- latest    NUNCA... En un momento me pueden meter un cambio MAYOR y que todo deje de funcionar
- 21.0.1    HABITUALMENTE TAMPOCO.... quiero todos los arreglos de bugs posibles
- *21.0*    Me asegura la funcionaldiad que quiero, pero con el mayor númerod e bugs arreglados posible.
- 21        NUNCA... En un momento me pueden meter un cambio con nueva funcionalidad QUE NO NECESITO... y puede contener nuevos bugs

Versiones de software:
21.0.1

                Se incrementa cuando?
    21 MAYOR    Cambio de diseño que hace que la nueva versión no sea compatible con la anterior
     0 MINOR    Nueva funcionalidad
     1 MICRO    Arreglo de un bug

---
## Kubernetes?

Kubernetes es un gestor/orquestador de GESTORES de contenedores.

En un entorno de producción: 
- Alta disponibilidad.
    Tratar de garantizar que un sistema esté funcionando una determinada cantidad de tiempo (normalmente pactada de antemano de forma contractual)
    99%
    99,9%
    99,99%
    Tratar de garantizar la NO PERDIDA de información (datos)

    Cómo lo intento? REDUNDANCIA -> Montar CLUSTER (grupo de procesos corriendo, todos haciendo el mismo trabajo) < - Balanceador de carga
                                                    activo-pasivo: 1 keycloak arrancado
                                                                   el otro está en espera. Si el primero falla, arranca éste
                                                    activo-activo

- Escalabilidad
    Capacidad de adptar la infra a las necesidades de cada momento (escalado horizontal)  = REPLICACION = REDUNDANCIA
    Muchos keycloak en paralelo = MONTAR UN CLUSTER
                                                    activo-activo. Tengo muchos en paralelo
    
Kubernetes:

Maquina 1
    Gestor de contenedores (CRIO/ContainerD)
        Contenedor Keycloak1
Maquina 2
    Gestor de contenedores (CRIO/ContainerD)
        Contenedor Keycloak3
Maquina n
    Gestor de contenedores (CRIO/ContainerD)
        Contenedor Keycloak2
---

En el curso no vamos a trabajar con Kubernetes. Nos complicaría mucho la vida.
Vamos a trabajar con contenedores y con Docker

---

# POSIX?

Es uno de los estándares que componen el estandar UNIX. 
En el se definen muchas cosas... entre ellas la estructura de carpetas que debe tener un sistema operativo.

---

# Qué era UNIX?

Un sistema operativo de los lab. Bell de la americana de telecomunicaciónes AT&T
Esto se dejo de hacer hace 20 años.

---

# Qué es UNIX?

Es un estandar (de hecho 2: POSIX + SUS) que define como montar un Sistema Operativo.
Muchos fabricantes de SO se acogen a este estandar.

HP      -> HP-UX    Sistema operativo UNIX®
IBM     -> AIX      Sistema operativo UNIX®
ORACLE  -> SOLARIS  Sistema operativo UNIX®
APPLE   -> MacOS    Sistema operativo UNIX®

---

Hay gente que también se ha basado en ese estandar para montar SOs... pero no los ha certificado (esto cuesta pasta)

# BSD

Berkley Software distribution. SO de la univ de Berkley. 386BSD -> FreeBSD, NetBSD, MacOS

# GNU

Intentaron montar un SO, cumpliendo con el estandar UNIX pero gratis y sin certificarse.

GNU is Not Unix

Montaron todo lo necesario para un SO: compiladores, shells (linea de comandos: bash, interfaces gráficas: gnome), editores de texto gedit...
ls, mkdir, cp, chmod

# Linux

No es un SO. Es un Kernel de SO... siguiendo los principios del estandar UNIX. 

Linux + GNU se hicieron amiguitos:

    70%  30%
SO GNU/Linux -> 
    RHEL
    Fedora
    Debian -> Ubuntu
    Suse
    ...
    
# ANDROID

En paralelo se monta Android. Lo monta la gente de googlem, toamndo el kernel de Linux y poniendo encima librerias y programas montados por ellos, sin nada de GNU


---
Procedimiento de instalación con Docker:
1- Descargar imagen del contenedor
    > $ docker pull quay.io/keycloak/keycloak

2- Crear el contenedor con keycloak, partiendo de esa imagen
    > $ docker container create .... montonones de argumentos: 
        - Abrir puertos
        - Montar volumenes
        - Dar variables de entorno
        
    Nos va a quedar una linea de código infumable!... Por suerte tenemos una alternativa: docker-compose
    
---

# VOCABULARIO KEYCLOUD:

## REALM

Entorno independiente para gestionar los:
- Usuarios 
- Clientes
- Permisos

Que puedan ser consumidos 