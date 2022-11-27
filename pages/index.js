import { useState,} from 'react'
import { createRoot } from 'react-dom/client';
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import axios from 'axios';


export default function Home() {

  let [isExist, setExist]  = useState(false);
  let [data, setData] = useState('');

  const handleClick = (e, path,id="") => {
    e.preventDefault();
    const password = document.querySelector('#linkUrl').value
    // console.log(typeof password)
    if (password != "") {
        if(path === "/cargar"){

            const input = document.getElementById(id);
            input.click();
      
            let txt = ""
            
            input.addEventListener("change",handleFiles,false);
      
            function handleFiles() {
              const fileList = this.files;
              const numFIles = fileList.length;
              const extPermit = /(.p12)$/i;
      
              for (let index = 0; index < numFIles; index++) {
                const file_ = fileList[index];
                if (extPermit.exec(file_.name)) {
                  console.log(file_.name);
                  console.log(file_.type);
      
                  if (this.files && this.files[0]) {
                    // console.log("content");
                    
                
                    //* submit data to api
                     
                    let visor = new FileReader();
                    visor.onload = async function(e) {
                      //console.log(e.target.result);
                      const p12File = e.target.result;
                      // console.log(typeof p12File)
                      
                      // const url_ = 'http://localhost:3000/api/getdataP12'
                      const url_ = 'https://next-visualization-pkcs-12.herokuapp.com/api/getdataP12'
                      
                      try {
                          const response =  await fetch(url_ ,{
                              method: 'POST',
                              // body: JSON.stringify({p12Name:file_.name, password: password}),
                              // body: JSON.stringify({p12Name:p12File, password: password}),
                              body: p12File,
                              headers: {
                                'Content-Type': 'application/pkcs12',
                                'Access-Control-Allow-Origin': '*'
                              },
                            });
                      
                      if (!response.ok) {
                          throw new Error(`Error! status: ${response.status}`);
                      }
                      const pkcs12Asn1 = await response.json();
                      console.log('pkcs12: ', pkcs12Asn1);

                      try {
                        // const url_2 = 'http://localhost:3000/api/configP12'
                        const url_2 = 'https://next-visualization-pkcs-12.herokuapp.com/api/configP12'
                        const response_p12 =  await fetch(url_2 ,{
                          method: 'POST',
                          body: JSON.stringify({password:password , pkcs12Asn1: pkcs12Asn1}),
                          headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                          },
                        });
                        const result = await response_p12.json();
                        console.log('Resultados: ', result);
                        if (result.status == "error") {
                          
                          alert("El archivo contiene no es compatible");
                          return;
                        }
                        if ( result.status == "password_error") {
                          
                          alert("Por favor corrija la contraseña o verifique el tipo de archivo" + result.error);
                          return;
                        }

                      // //* esta linea de codigo se puede refactorizar y colocar dentro de un componente que cree tablas
                      const elementCert = (
                        <div>
                          <h3>Campos del Certificado del archivo {file_.name}</h3>
                          <table className={styles.table_bordered}>
                            <tr>
                              <th>Clave</th>
                              <th>Contenido</th>
                            </tr>
                            <tr>
                              <td>NC del sujeto: </td>
                              <td>{result.nameSubject}</td>
                            </tr>
                            <tr>
                              <td>NC del editor: </td>
                              <td>{result.nameIssuer}</td>
                            </tr>
                            <tr>
                              <td>Tipo de llave: </td>
                              <td>{result.typeKey}</td>
                            </tr>
                            <tr>
                              <td>Periodo de validez: </td>
                              <td>{result.valid_from} - {result.valid_to}</td>
                            </tr>
                            <tr>
                              <td>Algoritmo MD: </td>
                              <td>{result.algorithmModulus}</td>
                            </tr>
                            <tr>
                              <td>OID de la firma digital: </td>
                              <td>{result.signatureOid}</td>
                            </tr>
                            <tr>
                              <td>Nro de Serial: </td>
                              <td>{result.serialNumber}</td>
                            </tr>
                            <tr>
                              <td>Signature: </td>
                              <td>{result.signature}</td>
                            </tr>
                          </table>
                        </div>
                      );
                      const container_cert = document.getElementById('showcert');
                      const root_cert = createRoot(container_cert); // createRoot(container!) if you use TypeScript
                      root_cert.render(elementCert);
      
                      const element = (
                        <div>
                          <h3>Campos de la llave privada del archivo {file_.name} </h3>
                          <table className={styles.table_bordered}>
                            <tr>
                              <th>Clave</th>
                              <th>data</th>
                              <th>t</th>
                              <th>s</th>
                            </tr>
                            <tr>
                              <td>modulus: </td>
                              <td>{result.n.data}</td>
                              <td>{result.n.t}</td>
                              <td>{result.n.s}</td>
                            </tr>
                            <tr>
                              <td>publicExponent: </td>
                              <td>{result.e.data}</td>
                              <td>{result.e.t}</td>
                              <td>{result.e.s}</td>
                            </tr>
                            <tr>
                              <td>privateExponent: </td>
                              <td>{result.d.data}</td>
                              <td>{result.d.t}</td>
                              <td>{result.d.s}</td>
                            </tr>
                            <tr>
                              <td>prime1: </td>
                              <td>{result.p.data}</td>
                              <td>{result.p.t}</td>
                              <td>{result.p.s}</td>
                            </tr>
                            <tr>
                              <td>prime2: </td>
                              <td>{result.q.data}</td>
                              <td>{result.q.t}</td>
                              <td>{result.q.s}</td>
                            </tr>
                            <tr>
                              <td>exponent1: </td>
                              <td>{result.DP.data}</td>
                              <td>{result.DP.t}</td>
                              <td>{result.DP.s}</td>
                            </tr>
                            <tr>
                              <td>exponent2: </td>
                              <td>{result.DQ.data}</td>
                              <td>{result.DQ.t}</td>
                              <td>{result.DQ.s}</td>
                            </tr>
                            <tr>
                              <td>coefficient: </td>
                              <td>{result.qInv.data}</td>
                              <td>{result.qInv.t}</td>
                              <td>{result.qInv.s}</td>
                            </tr>
                          </table>
                        </div>
                      );
                      const container = document.getElementById('showkey');
                      const root = createRoot(container); // createRoot(container!) if you use TypeScript
                      root.render(element);
                    
                      

                      } catch (error) {
                        console.log(error.message);
                      }
                      
                      
                      // setData(result);
                  
      
                      } catch (err) {
                          console.log(err.message);
                      }
      
                      //document.getElementById("showkey").innerHTML = '<embed src="'+e.target.result+'" width="500" height="500">';
                    };
                    // visor.readAsText(this.files[0]);
                    visor.readAsBinaryString(this.files[0]);
                    
                  }
                }else{
                  alert("no es un archivo .p12")
                }
                // const file = fileList[index];
                // txt += "<br><strong>" + (index+1) + ". file</strong><br>";
                // txt += "name: " + file.name + "<br>";
                // txt += "type: " + file.type + "<br>";
              }
              
              document.getElementById(id).value = "";
              // document.getElementById("showkey").innerHTML = txt;
            }
      
          //   HandleData(input);
      
      
      
            setExist(true);
            console.log("Cargando...");
          }
    }
    else{
        alert("Por favor primeramente ingrese la contraseña correctamente")
    }
  }
  const handleClear = (e, path,id="") => {
    if(path === "/limpiar" && isExist == true){
        let element = document.getElementById(id);
        let element2 = document.getElementById("showcert");
        //element.remove();
        element.innerHTML = "";
        element2.innerHTML = "";
        setExist(false);
        console.log("ELIMINADO")
    }
    }
  return (
      
    <div className={styles.container}>
      <Head>
       <title>Visor de llaves RSA</title>
       <meta name="description" content="Generated by create next app" />
       <link rel="icon" href="/favicon.ico" />
      </Head>
      

      <main className={styles.main}>
        <h2 className={styles.title}>
          Visor de llaves RSA
        </h2>
        
        <div>
          <form className={styles.main_form}>
            <div className={styles.main_form_inputs}>
              {/* <input className={styles.controls} type="text" name="linkUrl" id="linkUrl" placeholder="Suba un archivo de tipo .pem "></input> */}
              <input className={styles.controls} type="text" name="linkUrl" id="linkUrl" placeholder="[ ingresar la contraseña del archivo .p12 ]"></input>
              <div className={styles.main_button} id="main_button_veri">
                <div id="circle"></div>
                <Link href="/" legacyBehavior>
                  {/* <button></button> */}
                  <a onClick={(e) => handleClick(e, "/cargar","input-file")} className={styles.textcolor} >Cargar</a>
                </Link>
              </div>
              <input type="file" id="input-file" hidden multiple/>
            </div>
            
          </form>
        </div>

  
        {/* <div id = "showkey">{data}</div> funciona por el hooks*/}
        <div id = "showcert" className={styles.table_}></div>
        <div id = "showkey" className={styles.table_}></div>
        

        <div className={styles.main_button} id="main_button_veri">
          <div id="circle"></div>
          <Link href="/" legacyBehavior>
            <a onClick={(e) => handleClear(e, "/limpiar", "showkey")} className={styles.textcolor} >Limpiar Todo</a>
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
      </footer>
      </div>
  )
}
