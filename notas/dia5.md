# FLUJO DE OPERACIONES AL CONECTAR UNA APP (FRONT / BACK) con KEYCLOAK PARA AUTENTICAR

USUARIO         NAVEGADOR           WEB(JS)             KEYCLOAK            SERVIDOR WEB            SERVICIOS BACKEND

Felipe    >>>   url web   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Devuelve html+js+css
                Muestra HTML <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Ejecuta los JS >>>> Genera nuevo HTML
                Se representa <<<<<
                
Hace click      >>>>>>>>>>>>>>>>>>> UPS! necesito autenticar a Felipe
en un sitio     <<<<<<<<<<<<<<<<<<< REDIRECCION 3XX a Keycloak
que necesita                            redirection_uri
autenticacion                           client_id
                >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Devuelve el formulario de login
                Lo representa <<<<<<<<<<<<<<<<<<<<<<<<<<
                
Lo rellena >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Si el usuario es correcto, 
                                                         se genera TOKEN de acceso 
                                                         (Se queda guardado en CACHE)
                <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Devuelve un REDIRECT 3XX a la WEB
                                                         SIEMPRE Y CUANDO la redirect_url esté entre las permitidas
                
                Solicita la web >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Devuelve html+js+css
                Muestra HTML <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                Ejecuta los JS >>>> Recibo en mi programa de Front el TOKEN DE ACCESO
                                    De quién lo recibo? DEL NAVEGADOR
                                        Al Navegador se lo manda el KEYCLOAK
                                    Se lo he pedido YO en token a KeyCloak? NO
                                    Quién se lo ha pedido? El NAVEGADOR !
                                    
                                    Qué tiene sentido aquí? Que mi JS valide en token contra KeyCloak
                                        El token lleva datos... y una firma.
                                        Y con la firma que puedo hacer, revisar que los datos no han cambiado 
                                        Y que los ha firmado mi Keycloak
                                        
                                        Puedo preguntar a KeyCloak... El token es válido?
                                        Aquí siempre lo haré, el preguntar a Keycloak... por qué?
                                            Porque el TOKEN no proviene de un sitio (ORIGEN) de confianza = NAVEGADOR
                                            Y el keycloak me pregunte que quien soy? Le contesto?
                                                Le puedo contestar? Con qué dato? CLientID
                                                    Y el Secret? NO puedo
                                            Explicitamente aviso a KeyCloak que no debe validarme las peticiones
                                    
                                    
                                    Voy a meter datos en el HTML de un servicio de mi BACKEND
                                    Lanzar un request al Backend >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Se recibe el TOKEN que se envía y...
                                    - Quiero datos!!!!
                                    - Y los quiero en nombre de FELIPE!
                                      - Y eso eso va dentro del TOKEN DE ACCESO
                                                                                                    Se valida:
                                                                                                     - Quién me pide esto? 
                                                                                                        La app?
                                                                                                        o un pirata que se ha hecho con el token?
                                                                                                        Se hace a través de origen de la petición. 
                                                                                                            ENTRA AQUI KEYCLOAK? NO.... CORS del backend
                                                                                                     - Comprueba que el token es generado por el KeyCloak... cómo?
                                                                                                       - Opción 1: FIRMA >>> OFFLINE
                                                                                                       - Opción 2: Le pregunto a KeyCloak >>> ONLINE
                                                                                                            Así me aseguro de que la sesión/TOKEN sigue siendo válida
                                                                                                            No ha sido revocado
                                                                                                                Manda su Client_ID y Secret
                                                        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                                        Quién me pide esto? 
                                                            Miro el:
                                                                CLIENT_ID
                                                                SECRET
                                                            Mirar el origen de la petición
                                                                Dentro de las permitidas
                                                                
                                                                *** ESTO LO HACEMOS SOLO EN BACKEND, que
                                                                    - Conozco el ORIGEN
                                                                    - Y LOS ORIGENES VALIDOS
                                                                
                                                        Mira que el TOKEN esté en su CACHE!
                                                        Y se confirma >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                                                                                    Miro si puedo ejecutar la operación que me solicitan
                                                                                                    Miro si el usuario tiene permisos para la operación que se solicita
                                    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Y entonces, la ejecuto... y devuelvo los datos
                                                        
                                    Genera nuevo HTML. 
                Se representa <<<<<
                
USUARIO         NAVEGADOR           WEB(JS)             KEYCLOAK            SERVIDOR WEB            SERVICIOS BACKEND
