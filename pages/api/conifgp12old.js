
const p12 = require('p12-pem');
const fs = require('fs');
const {X509Certificate} = require('crypto')
const pem2jwk = require('pem-jwk').pem2jwk
const forge = require('node-forge');

export default function handler(req, res) {
    
    
    if (req.method === 'POST') {
        try {
            const password = req.body.password;
            var pkcs12 = forge.pkcs12.pkcs12FromAsn1(req.body.pkcs12Asn1.data, false, password);
            var keyData = pkcs12.getBags({ bagType: forge.pki.oids.keyBag });
            var certBags = pkcs12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag];
            // console.log(certBags[0]);
            var cert = certBags[0];
            // console.log(certBags);
            // var bag = keyData[forge.pki.oids.safeBags][0];
            // var key = bag.key;
            // console.log(key);

            
            var privateKey;
            for(var sci = 0; sci < pkcs12.safeContents.length; ++sci) {
                var safeContents = pkcs12.safeContents[sci];
            
                for(var sbi = 0; sbi < safeContents.safeBags.length; ++sbi) {
                    var safeBag = safeContents.safeBags[sbi];
            
                    // this bag has a private key
                    if(safeBag.type === forge.pki.oids.keyBag) {
                        //Found plain private key
                        privateKey = safeBag.key;
                        // console.log("llave privada : ", privateKey)
                    } else if(safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
                        // found encrypted private key
                        privateKey = safeBag.key;
                        // console.log("llave privada encryptada: ", privateKey)
                    } else if(safeBag.type === forge.pki.oids.certBag) {
                        // console.log("data");
                        // console.log(safeBag);
                        // this bag has a certificate...        
                    }   
                }
            }
            //** data del certificado */
            
            var nameSubject = "";
            cert.cert.subject.attributes.forEach(element => {
               
               if (element.shortName == 'CN') {
                    nameIssuer = element.value;
               } 
            });


            var nameIssuer = "";
            cert.cert.issuer.attributes.forEach(element => {
               
               if (element.shortName == 'CN') {
                    nameIssuer = element.value;
               } 
            });

            var typeKey = "public";
            var valid_from = cert.cert.validity.notBefore;
            var valid_to = cert.cert.validity.notAfter;
            var algorithmModulus = cert.cert.md.algorithm; 
            var signature = cert.cert.signature;
            var serialNumber = cert.cert.serialNumber;
            var signatureOid = cert.cert.signatureOid;
            
            
            console.log(privateKey);

            
            // const nameIssuer = cert.cert.issuer.attributes[cert.cert.issuer.attributes.length - 1].value
            // // const nameSubject
            // console.log(cert.cert.subject.attributes);
        
        
        // let path_ = 'data.p12';
        // console.log(path_);
        // try {
        //     const {pemKey, pemCertificate, commonName} = p12.getPemFromP12(path_, password);
        //     // console.log(pemCertificate.toString("base64"));
        //     // console.log(pemKey.toString("base64"));

        //         // //** for certificate */
        //     const begincer = pemCertificate.slice(0,27);
        //     const endincer = pemCertificate.slice(pemCertificate.length -25,pemCertificate.length);
        //     const midlecer = pemCertificate.slice(27,pemCertificate.length -25);
        //     const pemCertificatevalid = begincer+"\n"+midlecer+"\n"+endincer;

        //     const x509list = new X509Certificate(pemCertificatevalid);
        //     const objectCert = x509list.toLegacyObject();

        //     const typeKey = x509list.publicKey.type
        //     //nombre comun
        //     const inToremove = "CN="

        //     // read issuer's data
        //     const listNameIssuer = objectCert.issuer
        //     //console.log(listNameIssuer)
            
        //     let nameIssuer = ""
        //     listNameIssuer.split(/\n/).forEach(function(listname){
        //         if (listname.includes(inToremove)) {
        //             nameIssuer = listname.replaceAll(inToremove, "");
        //         }
        //     });

        //     const inToremove_subject = "CN="

        //     // read issuer's data
        //     const listNameSubject = objectCert.subject
        //     //console.log(listNameIssuer)
            
        //     let nameSubject = ""
        //     listNameSubject.split(/\n/).forEach(function(listname){
        //         if (listname.includes(inToremove_subject)) {
        //             nameSubject = listname.replaceAll(inToremove_subject, "");
        //         }
        //     });
        //     // console.log(objectCert);
            
        //     //** for private key */

        //     const beginkey = pemKey.slice(0,31)
        //     const endkey = pemKey.slice(pemKey.length -29,pemKey.length)
        //     const midkey = pemKey.slice(31,pemKey.length-29)
        //     const pemKeyvalid = beginkey+"\n"+midkey+"\n"+endkey

        //     const jwkPrivateKey = pem2jwk(pemKeyvalid);
        
        //     // console.log(jwkPublic);

        // res.status(200).json({ 
        //     status: "good",
        //     certificate: objectCert,
        //     privatekey: jwkPrivateKey,
        //     typeKey: typeKey,
        //     nameIssuer: nameIssuer,
        //     nameSubject: nameSubject
        // });

            res.status(200).json({ 
                status: "good",
                nameSubject:nameSubject,
                nameIssuer:nameIssuer,
                typeKey: typeKey,
                valid_from: valid_from,
                valid_to: valid_to,
                algorithmModulus: algorithmModulus,
                signature: signature,
                serialNumber: serialNumber,
                signatureOid: signatureOid,   
                // privateKey: privateKey
            
            });

        } catch (error) {
            // console.log(error.message);
            res.status(200).json({ 
                status: "password_error",
                error: error.message
            });
        }
        
    }
    res.status(200).json({ 
        status: "good",
    });
}
  