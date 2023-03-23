import React, { Component } from 'react'
import Keycloak from "keycloak-js"
import decode from 'jwt-decode'
import JSONPretty from 'react-json-pretty'

const Config = { // Mapa de JAVA
    url: 'https://3.253.29.47:8443',
    realm: 'prueba',
    clientId: 'react',
    onLoad: 'login-required',
    scope: 'telefono'
}

class KeycloakLogin extends Component {

    constructor(props) {
        super(props);
        this.state = { keycloak: null, authenticated: false };
                                     // ^ Contiene la respuesta que nos da Keycloak cuando nos logueamos (TOKEN)
                    // ^ Contiene información de la CONEXION a nuestro KEYCLOAK
    }

    componentDidMount() {
        const keycloak = Keycloak(Config);
        keycloak.init().then(authenticated => {
            this.setState({ keycloak: keycloak, authenticated: authenticated })
        });
    }

    render() {
        if (this.state.keycloak && this.state.authenticated ) {
            //return this.state.keycloak.token;
            var jwt = JSON.stringify(decode(this.state.keycloak.token));
            return <div>
                        <JSONPretty id="json-pretty" data={jwt}></JSONPretty>
                    </div>
        } else {
            return <div>Esperando a login de KeyCloak</div>
        }
    }

}

export default KeycloakLogin

// Base64? Ni es un HASH ni es encripcion. ME asegura que un texto lo puedo represntarcon caracter BASICOS DE ASCII
// Codificación: UTF8 ASCII, 