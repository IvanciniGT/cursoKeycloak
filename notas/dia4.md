CREACION DE TEMAS:

1. Coger las plantillas que me da la gente de KeyCloak
2. Extraer esas plantillas y RENOMBRARLAS en la carpeta /opt/keycloak/themes
3. Arrancar el keyCloak en modo DESARROLLO (start-dev), esto me garantiza que las plantillas NO SE CACHEAN
--- ** En la empresa me faltaría: Meter esas carpetas en un proyecto MAVENIZADO y todo a GIT
   Y puedo ir haciendo cambios que veo reflejados en la UI en tiempo real
4. Modificar las plantillas e ir guardando las versiones que voy generando de esas plantillas en un REPO de GIT
 
*** Hasta aquí desarrollo ***

*** Desde aquí, cómo empaqueto y disribuyo este desarrollo ***


5. Cuando tenga el trabajo listo: Genero un jar
6. Copio ese jar en la carpeta /opt/keycloak/providers
7. Elimino lo que tengo en la carpeta themes
8. Hago un build para generar una configuración optimizada de keyCloak
9. Arranco Keycloak en modo optimizado


---

En qué entorno vamos a hacer esto? en el de producción? NI DE COÑA!

Cuantos entornos de Keycloak voy a tener en la empresa? Al mmenos 3

- Desarrollo
- Pruebas
- Producción

La fase de desarrollo acaba cuando genero: UNA IMAGEN DE CONTENEDOR
Ese artefacto (La imagen de contenedor) se almacena en un REGISTRY DE REPOS DE IMAGENES DE CONTENEDOR: jfrog, artifactory, nexus...

Esa imagen de contenedor debe ser PERSONALIZABLE. 
De hecho la que uso yo para hacer mi DESARROLLO, la que se pasa al entorno de PRUEBAS y la que se sube a PRODUCCION debe ser la misma!

De esa imagen de contenedor se crean contenedores en un cluster de kubernetes... en AUTOMATICO (lo hace Kubernetes)
El de Operaciones configura Kubernetes para que haga ese trabajo: (a éste tio, muchos le llamais el DEVOPS)
- Configurar un Deployment, StatefulSet... Service, Ingress... Cosas de Kubernetes

---

Imaginad que estoy montando una app WEB JAVA TRADICIONAL de hace 20 años MONOLITICA, con sus JSPs.
Cual es mi entregable? Que es lo que paso a la gente de Operaciones/Producción? Un .war .ear

Con Springboot, en microservicios que entregamos: .war .jar (que lleve embebido el app server)
Dónde se guarda ese JAR o WAR? En un REPOSITORIO DE ARTEFACTOS: jfrog, artifactory, nexus...

Que hacía el de operaciones (el de middleware)? Montar eso en un Servidor de aplicaciones JAVA : Weblogic, Websphere, Tomcat
Se depliega en 20 serv. de apps... con balanceadores de carga, con proxies reversos, con una bbdd de producción optimizada en cluster o con replciación

---

NODE    Es el quivalente a la máquina virtual de JAVA
        Me permite ejecutar JS fuera de un navegador

NPM     El equivalente en JAVA a MAVEN para el mundo JS

---

Maven arquetipo creado
Que me genera la estructura básica de proyecto maven

----

# Frontal JS . En nuestro caso REACT-JS

Proyecto, copmo si fuera JAVA.. con su código -> JS

Vamos a usar una herramienta que se llama node = JVM

Con node nosotros creamos un servidor WEB De pruebas.

En ese servidor WEB tendremos un html y un montón de JS, que irán generan más HTML
No creamos ficheros HTML con el JS... creamos COMPONENTES WEB = Trozos de HTML
que vamos inyectando/modificando/eliminando del fichero HTML del que partimos.

SPA = Single Page Application

Todo el código JS que vamos a escribir, cuando se distribuyera el proyecto, se empaquetaría en un UNICO fichero .js
Que si lo miraseis pareceria CHINO !
Y ese JS, junto con los CSS, imagenes ,y html se cargarían en un servidor WEB (Apache, nginx... tomcat)

En desarrollo, nos es cómodo usar NODE para crear ese servidor WEB.

Vamos a usar también npm... El equivalente en el mundo JS a MAVEN


---

public class Usuario{
    
    public String nombre;
    public int edad;
    
    public Usuario(){
        this.nombre="Ivan";
        this.edad=44;
    }
    
}
---
class Usuario extends React.Component{
    
    constructor(){
        this.state = {
            "nombre": "Ivan",
            "edad": 44
        }
    }
    componentDidMount(){
        // REACT llama a esta función, desdepués de que el constructor se ha ejecutado y el objeto (la instancia)
        se ha inyectado en el navegador
    }
    render(){
        return <div>
                <p><strong>Nombre:</strong> {this.state.nombre} </p>
               </div>
    }
    
}

<Usuario>