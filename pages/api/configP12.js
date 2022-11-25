
var rsaPemToJwk = require('rsa-pem-to-jwk');

export default function handler(req, res) {
    if (req.method === 'POST') {
        
        // console.log(req.body.pemFile)
        const jwk = rsaPemToJwk(req.body.pemFile);
        // console.log(jwkPublic);
        res.status(200).json({ jwk: jwk })    
    }
  }
  