const express = require('express');
const app = express();
const path = require('path');
const mongose = require('mongoose');
const bodyParser = require(`body-parser`);
const bcrypt = require(`bcrypt`);
const fs = require(`fs`).promises;
const fss = require(`fs`);
const generateNum = require(path.join(__dirname, `middleware`, `generateNum`));
const upload = require(path.join(__dirname, `middleware`, `fileUpload`));
const archive = require(path.join(__dirname, `middleware`, `fileArchiver`));
const FileModel = require(path.join(__dirname, `/middleware/fileModel`));
const LoginModel = require(path.join(__dirname, `/middleware/loginModel`));
const PassModel = require(path.join(__dirname, `middleware/passModel`));
const archiver = require(`archiver`)
require(`dotenv`).config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'platformer test')));

mongose.connect('mongodb+srv://admin:LJzwBv6fWx0OALWT@cluster0.l8383kd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
})

let limitedUser = [];

app.post('/upload/:login/:password', upload.array('files'), async(req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const {login, password} = req.params;
    const fileField = req.files;
    console.log(fileField)
      switch (true) {
          case limitedUser.includes(ip):
              res.send(`You have exceeded the limit. Await 5 minute`);
              fileField.forEach(async(e) => {    
                await fs.unlink(`./uploads/${e.filename}`);
              });
              break;
          case fileField.length == 0:
              res.send(`Files undefinded`);
              break;
          case login == `false`:
            
            const code = generateNum();
            fileField.forEach((e) => {
                let fileModel = FileModel({
                    code:code,
                    filePath:e.filename,
                    login:`${login}`
                });
                fileModel.save();

                setTimeout(async() => {
                    await FileModel.deleteOne({code:code, filePath:e.filename});
                    await fs.unlink(`./uploads/${e.filename}`);
                }, 604800000);
    
            });
                    
            // limitedUser.push(ip);
            setTimeout(() => {
                limitedUser = limitedUser.filter((e) => e != ip);
            }, 300000);
  
            res.json(code);
            break;
          case login != `false`:
            const match = await LoginModel.findOne({login:login});
            if(match == null){
                res.send(`This login doesn't exist`);
            
            } else {
                const saltedPass = `${password}`+`${match.salt}`;
                const hashTable = await PassModel.find();
                let result;

                for(let i =0; i<hashTable.length; i++) {
                    result = await bcrypt.compare(saltedPass, hashTable[i].hash);
                    if(result == true){
                        break;
                    }
                };
  
                if (result == true){
                    const code = generateNum();
                    fileField.forEach((e) => {
                    let fileModel = FileModel({
                        code:code,
                        filePath:e.filename,
                        login:`${login}`
                    });
                    fileModel.save();
                    });
                    
                    limitedUser.push(ip);
                    setTimeout(() => {
                        limitedUser = limitedUser.filter((e) => e != ip);
                    }, 300000);
  
                    res.json(code);

                } else{
                    res.send(`Incorrect password`);
                };
              
              };
        };
});

app.get(`/download/:code`, async(req, res) => {
    const code = req.params.code;
    const regex = /^[0-9]+$/;
    if(regex.test(code)){
    const reqFile = await FileModel.find({code:`${code}`});
    if(reqFile.length == 0){
        res.status(404).send(`This code doesn't exist`);
    }else{
        let filesArr = [];
        reqFile.forEach((e) => {
            filesArr.push(`./uploads/${e.filePath}`);
            
    });

    const archivePath = await archive(`./uploads/${reqFile[0].code}`, filesArr);
        
    res.download(`./uploads/${reqFile[0].code}.zip`, (err) => {
        fs.unlink(`./uploads/${reqFile[0].code}.zip`);
    });
        
    
    }
    } else {
        res.status(404).send(`This code doesn't exist`);

    }
});





app.delete(`/deleteUrl/:code/:login/:password`, async(req, res) => {
    const {code, login, password} = req.params;
        const match = await FileModel.find({code:`${code}`, login:`${login}`});
        if(match.length == 0){
            res.send(`This code or login doesn't exist`);
        } else {
            const loginTable = await LoginModel.findOne({login:login});

            const saltedPass = `${password}`+`${loginTable.salt}`;
            const hashTable = await PassModel.find();
            
            for(let i =0; i<hashTable.length; i++) {
                result = await bcrypt.compare(saltedPass, hashTable[i].hash);
                if(result == true){
                    break;
                }
            }

            if (result == true){
                await Promise.all(match.map(e => fs.unlink(`./uploads/${e.filePath}`)));

                const dltRep = await FileModel.deleteMany({code:`${code}`, login:`${login}`});
                res.send(`Succesfully deleted`);

            } else{
                res.send(`Incorrect password`);
            };
    
        }
    }
);

app.post(`/registration`, async(req, res) => {
    const {password, login} = req.body;
    const matches = await LoginModel.find({login:login});
    if(matches.length == 0) {
        const salt = Math.random().toString(36).substring(2, 12 + 2);
        const saltedPass = `${password}` + `${salt}`;
        bcrypt.hash(saltedPass, 10, (err, hash) => {
            const userPass = PassModel({
                hash:hash
            });
            userPass.save();
        });

        
        const newUser = LoginModel({
            login:`${login}`,
            salt:`${salt}`,
        });

        newUser.save();

        res.send(`Succesfully regisrated`);
    } else {
        res.send(`Login is occupied`);
    }
    
});

app.post(`/signIn/`, async(req, res) => {
    const {password, login} = req.body;
    const match = await LoginModel.findOne({login:login});
    let result;
    if(match != null) {
        const saltedPass = `${password}`+`${match.salt}`;
        const hashTable = await PassModel.find();
        
        for(let i =0; i<hashTable.length; i++) {
            result = await bcrypt.compare(saltedPass, hashTable[i].hash);
            if(result == true){
                break;
            }
        }

        if (result == true){
            const userHistory = await FileModel.find({login:login});
            res.json({mesage:`Succesfully signed in`, history:userHistory });
        } else{
            res.send(`Incorrect password`);
        };
    
    } else {
        res.send(`Incorrect login`);
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


