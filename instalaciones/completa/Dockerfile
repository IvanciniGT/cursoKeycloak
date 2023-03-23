### PARTE 1: Generar certificado y reconfigurar el keycloak con la BBDD concreta que vamos a usar
FROM quay.io/keycloak/keycloak:21.0 as federico

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak

# Generamos un cetificado autofirmado.
# Para el curso está guay.... para un entorno real de producción, 
# Inyectar aqui dentro un certificado DE VERDAD, de una CA reputada !
# /opt/keycloak/conf/server.keystore
ENV KC_HOSTNAME=3.253.29.47 
                              # AQUI PONEMOS LA IP QUE SACAMOS DEL "curl ifconfig.me"
                              # En un entorno real, que pondríamos ahí?
                              # El fqdn del servidor => El nombre de red del servidor de keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:$KC_HOSTNAME" -keystore conf/server.keystore

# Con estas 2 lineas le quitamos al contenedor unos 10-20 segundos en el arranque
ENV KC_DB=postgres
RUN /opt/keycloak/bin/kc.sh build       
# Este es el que optimiza el keycloak.
# Carga solamente los drivers de BBDD que nosotros queremos... si no por defectco se carga todo.


### PARTE 2: Ahí dejamo ya generada la imagen que queremos nosotros.
FROM quay.io/keycloak/keycloak:21.0
COPY --from=federico /opt/keycloak/ /opt/keycloak/
ENV KC_DB=postgres


# Esta linea NO ES NECESARIA PARA QUE PUEDAN CAMBIARME EL FICHERO DE CLAVES
# Pero va a dar pistas a quien vaya a usar esta IMAGEN. 
# Le aparecerá explicitamente el sitio donde debe copiar ese archivo
# DOCUMENTACION !
#VOLUME ["/opt/keycloak/conf/server.keystore"]

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
