
const p12 = require('p12-pem');
const fs = require('fs');
const {X509Certificate} = require('crypto')
const pem2jwk = require('pem-jwk').pem2jwk

export default function handler(req, res) {
    
    if (req.method === 'POST') {
    
        const data = req.body.p12Name;
        if (data == "negativa.p12") {
            res.status(200).json({ 
                status: "error",
            });
        }
        if (req.body.password != '1234'){
            res.status(200).json({ 
                status: "password_error",
            });
        }
        let path_ = "./pages/resources/" + data;
        console.log(path_);
        const {pemKey, pemCertificate, commonName} = p12.getPemFromP12(path_, req.body.password);
        
        
        
        // //** for certificate */
        const begincer = pemCertificate.slice(0,27);
        const endincer = pemCertificate.slice(pemCertificate.length -25,pemCertificate.length);
        const midlecer = pemCertificate.slice(27,pemCertificate.length -25);
        const pemCertificatevalid = begincer+"\n"+midlecer+"\n"+endincer;

        const x509list = new X509Certificate(pemCertificatevalid);
        const objectCert = x509list.toLegacyObject();

        const typeKey = x509list.publicKey.type
        //nombre comun
        const inToremove = "CN="

        // read issuer's data
        const listNameIssuer = objectCert.issuer
        //console.log(listNameIssuer)
        
        let nameIssuer = ""
        listNameIssuer.split(/\n/).forEach(function(listname){
            if (listname.includes(inToremove)) {
                nameIssuer = listname.replaceAll(inToremove, "");
            }
        });

        const inToremove_subject = "CN="

        // read issuer's data
        const listNameSubject = objectCert.subject
        //console.log(listNameIssuer)
        
        let nameSubject = ""
        listNameSubject.split(/\n/).forEach(function(listname){
            if (listname.includes(inToremove_subject)) {
                nameSubject = listname.replaceAll(inToremove_subject, "");
            }
        });
        // console.log(objectCert);
        
        //** for private key */

        const beginkey = pemKey.slice(0,31)
        const endkey = pemKey.slice(pemKey.length -29,pemKey.length)
        const midkey = pemKey.slice(31,pemKey.length-29)
        const pemKeyvalid = beginkey+"\n"+midkey+"\n"+endkey

        const jwkPrivateKey = pem2jwk(pemKeyvalid);
    
        // console.log(jwkPublic);

        res.status(200).json({ 
            status: "good",
            certificate: objectCert,
            privatekey: jwkPrivateKey,
            typeKey: typeKey,
            nameIssuer: nameIssuer,
            nameSubject: nameSubject
        });
    }
}
  