import { getX509Certificate, parsePKCS12 } from '@expo/pkcs12';
const p12 = require('p12-pem');
const forge = require('node-forge');

const fs = require('fs');


function arrayBufferToString( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
}
export default function handler(req, res) {
    
    if (req.method === 'POST') {
    
        const data = req.body;
   
        const pkcs12B64 = forge.util.encode64(data);  
        const pkcs12Der= forge.util.decode64(pkcs12B64);
        const pkcs12Asn1 = forge.asn1.fromDer(pkcs12Der);

        res.status(200).json({
            data: pkcs12Asn1
        })
        
        // fs.writeFileSync("data.p12", data, {encoding: 'binary'});
    }

    res.status(200).json({
        status: "good"
    })
}
  