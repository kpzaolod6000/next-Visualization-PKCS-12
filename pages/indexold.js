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
    if(path === "/cargar"){

      const input = document.getElementById(id);
      input.click();

      let txt = ""
      input.addEventListener("change",(e) => {

        const fileList = e.target.files[0].name;
        // console.log(fileList)
        // const numFIles = fileList.length;
        const extPermit = /(.p12)$/i;

        // const file_ = fileList;
        if (extPermit.exec(fileList)) {

            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener('load',async (e) =>{
              const p12File = e.target.result;
              console.log(p12File)
              
              const url_ = 'http://localhost:3000/api/configP12'
              const response = await fetch(url_ ,{
                method: 'POST',
                body: JSON.stringify({p12File:p12File}),
                headers: {
                  'Content-Type': 'application/json'
                },
              });
          })
        }
        else {
          alert("no es un archivo .pem")
        }
      });

      
      // input.addEventListener("change",handleFiles,false);

      // function handleFiles() {
      //   const fileList = this.files;
      //   const numFIles = fileList.length;
      //   const extPermit = /(.p12)$/i;

      //   for (let index = 0; index < numFIles; index++) {
      //     const file_ = fileList[index];
      //     if (extPermit.exec(file_.name)) {
      //       console.log(file_.name);
      //       console.log(file_.type);

      //       if (this.files && this.files[0]) {
      //         // console.log("content");
              
          
      //         //* submit data to api
               
      //         let visor = new FileReader();
      //         visor.onload = async function(e) {
      //           //console.log(e.target.result);
      //           const p12File = e.target.result;
      //           // console.log(typeof p12File)
                
      //           const url_ = 'http://localhost:3000/api/configP12'
      //           try {
      //               const response = await fetch(url_ ,{
      //                   method: 'POST',
      //                   body: JSON.stringify({p12File:p12File}),
      //                   headers: {
      //                     'Content-Type': 'application/json'
      //                   },
      //               // const response = await axios.request({
      //               //       url: url_,
      //               //       method: 'post',
      //               //       headers: {
      //               //           "content-type": "application/json",
      //               //       },
      //               //       data: JSON.stringify({
      //               //           p12File:p12File
      //               //       }),
      //                 });
                
      //           if (!response.ok) {
      //               throw new Error(`Error! status: ${response.status}`);
      //           }
                
      //           const result = await response.json();
      //           console.log('JWK: ', result);
      //           // console.log(result.jwk.kty);
                
      //           // setData(result);
           

      //           //* esta linea de codigo se puede refactorizar y colocar dentro de un componente que cree tablas
      //           // const elementCert = (
      //           //   <div>
      //           //     <h3>Campos del archivo {file_.name}</h3>
      //           //     <table className={styles.table_bordered}>
      //           //       <tr>
      //           //         <th>Clave</th>
      //           //         <th>Contenido</th>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>modulus</td>
      //           //         <td>{result.jwk.n}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>publicExponent</td>
      //           //         <td>{result.jwk.e}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>privateExponent</td>
      //           //         <td>{result.jwk.d}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>prime1</td>
      //           //         <td>{result.jwk.p}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>prime2</td>
      //           //         <td>{result.jwk.q}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>exponent1</td>
      //           //         <td>{result.jwk.dp}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>exponent2</td>
      //           //         <td>{result.jwk.dq}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>coefficient</td>
      //           //         <td>{result.jwk.qi}</td>
      //           //       </tr>
      //           //     </table>
      //           //   </div>
      //           // );
      //           // const container_cert = document.getElementById('showcert');
      //           // const root_cert = createRoot(container_cert); // createRoot(container!) if you use TypeScript
      //           // root_cert.render(elementCert);

      //           // const element = (
      //           //   <div>
      //           //     <h3>Campos del archivo {file_.name} </h3>
      //           //     <table className={styles.table_bordered}>
      //           //       <tr>
      //           //         <th>Clave</th>
      //           //         <th>Contenido</th>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>modulus</td>
      //           //         <td>{result.jwk.n}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>publicExponent</td>
      //           //         <td>{result.jwk.e}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>privateExponent</td>
      //           //         <td>{result.jwk.d}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>prime1</td>
      //           //         <td>{result.jwk.p}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>prime2</td>
      //           //         <td>{result.jwk.q}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>exponent1</td>
      //           //         <td>{result.jwk.dp}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>exponent2</td>
      //           //         <td>{result.jwk.dq}</td>
      //           //       </tr>
      //           //       <tr>
      //           //         <td>coefficient</td>
      //           //         <td>{result.jwk.qi}</td>
      //           //       </tr>
      //           //     </table>
      //           //   </div>
      //           // );
      //           // const container = document.getElementById('showkey');
      //           // const root = createRoot(container); // createRoot(container!) if you use TypeScript
      //           // root.render(element);
              
                
      //           } catch (err) {
      //               console.log(err.message);
      //           }

      //           //document.getElementById("showkey").innerHTML = '<embed src="'+e.target.result+'" width="500" height="500">';
      //         };
      //         visor.readAsText(this.files[0]);

      //       }
      //     }else{
      //       alert("no es un archivo .pem")
      //     }
      //     // const file = fileList[index];
      //     // txt += "<br><strong>" + (index+1) + ". file</strong><br>";
      //     // txt += "name: " + file.name + "<br>";
      //     // txt += "type: " + file.type + "<br>";
      //   }
      //   // document.getElementById("showkey").innerHTML = txt;
      // }

      //HandleData(input);



      setExist(true);
      console.log("Cargando...");
    }
    if(path === "/limpiar" && isExist == true){
      let element = document.getElementById(id);
      //element.remove();
      element.innerHTML = "";
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
            <a onClick={(e) => handleClick(e, "/limpiar", "showkey")} className={styles.textcolor} >Limpiar Todo</a>
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
      </footer>
      </div>
  )
}
