
const fs = require('fs');


export default function handler(req, res) {
    
    if (req.method === 'POST') {
    
        const data = req.body;
        fs.writeFileSync("data.p12", data, {encoding: 'binary'});
    }

    res.status(200).json({
        status: "good"
    })
}
  