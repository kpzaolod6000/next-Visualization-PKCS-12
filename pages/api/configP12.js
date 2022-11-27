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

            
            var privateKey = {};
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
                    nameSubject = element.value;
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
            
            
            // console.log(privateKey);
            const n = privateKey.n;
            const e = privateKey.e;
            const d = privateKey.d;
            const p = privateKey.p;
            const q = privateKey.q;
            const dP = privateKey.dP;
            const dQ = privateKey.dQ;
            const qInv = privateKey.qInv;


            res.status(200).json({ 
                status: "good",
                nameSubject: nameSubject,
                nameIssuer: nameIssuer,
                typeKey: typeKey,
                valid_from: valid_from,
                valid_to: valid_to,
                algorithmModulus: algorithmModulus,
                signature: signature,
                serialNumber: serialNumber,
                signatureOid: signatureOid,   
                n: n,
                e: e,
                d: d,
                p: p,
                q: q,
                DP: dP,
                DQ: dQ,
                qInv: qInv
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
  