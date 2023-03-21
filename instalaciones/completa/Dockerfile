### PARTE 1: Generar certificado y reconfigurar el keycloak con la BBDD concreta que vamos a usar
FROM quay.io/keycloak/keycloak:21.0 as builder

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
WORKDIR /opt/keycloak

ENV KC_HOSTNAME=54.78.246.198 
                              # AQUI PONEMOS LA IP QUE SACAMOS DEL "curl ifconfig.me"
                              # En un entorno real, que pondríamos ahí?
                              # El fqdn del servidor => El nombre de red del servidor de keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:$KC_HOSTNAME" -keystore conf/server.keystore

# Con estas 2 lineas le quitamos al contenedor unos 10-20 segundos en el arranque
ENV KC_DB=postgres
RUN /opt/keycloak/bin/kc.sh build

### PARTE 2: Ahí dejamo ya generada la imagen que queremos nosotros.
FROM quay.io/keycloak/keycloak:21.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENV KC_DB=postgres

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
