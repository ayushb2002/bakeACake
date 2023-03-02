const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const User = require('./models/user');
const Question = require('./models/questions');
const Leaderboard = require('./models/leaderboards');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
var salt = bcrypt.genSaltSync(10);
const port = process.env.PORT || 4000;

main().catch(err => console.log(err));

async function main() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    
    app.listen(port, () => console.log(`Listening on port ${port}`));
}

app.get('/', (req, res) => {
  res.send('Access protected!');
});

app.post('/register', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var flag = true;
        await User.findOne({
            'email': `${req.body.email}`
        }).then(docs => {
            if (Object.keys(docs).length > 0) {
            flag = false;
            }
        }).catch(err => console.log(err));

        if(flag)
        {
            const user = new User();
            user.enrollment = `${req.body.enrollment}`;
            user.email = `${req.body.email}`;
            user.name = `${req.body.name}`;
            user.password = bcrypt.hashSync(`${req.body.password}`, salt);
            user.save();
        }
        res.send({'success': flag});
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/login', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var flag = false;
        var name = '';
        var enrollment = '';
        await User.findOne({
            'email': `${req.body.email}`
        }).then((docs) => {
            if(bcrypt.compareSync(`${req.body.password}`, docs.password))
            {
                flag = true;
                name = docs.name;
                enrollment = docs.enrollment;
            }
        }).catch((err) => {
            console.log(err);
        });
        if(flag)
        {
            res.send({'success': flag, 'name': name, 'enrollment': enrollment});
        }
        else
        {
            res.send({'success': flag});
        }
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/addQuestion', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var qno = `${req.body.qno}`;
        var ques = `${req.body.question}`;
        var file = `${req.body.file}`;
        var answer = `${req.body.answer}`;
        var flag = true;

        await Question.findOne({
            'qNo': qno
        }).then((docs) => {
            if(Object.keys(docs).length > 0)
                flag = false;
        }).catch(err => {console.log(err); flag=false;});

        try
        {
            const quest = new Question()
            quest.qNo = qno;
            quest.question = ques;
            quest.file = file;
            quest.answer = bcrypt.hashSync(answer, salt);
            quest.save();
            flag = true;
        }
        catch(err)
        {
            console.log(err);
            flag = false;
        }

        res.send({'success': flag});
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/updateLeaderboard', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var flag = false;
        var points = 10;
        const user = await User.findOne({'enrollment': `${req.body.enrollment}`});
        const question = await Question.findOne({'qNo': `${req.body.qNo}`});
        if(user)
        {
            await Leaderboard.findOne({
                'user': user
            }).then(async (docs) =>
            {
                if(docs == undefined)
                {
                    const lb = new Leaderboard();
                    lb.user = user;
                    lb.points = points;
                    lb.lastAttempt = question;
                    lb.save();
                    flag = true;
                }
                else
                {
                    await Leaderboard.deleteOne({'user': user}).then(()=> {
                        const lb = new Leaderboard();
                        lb.user = user;
                        if (docs.lastAttempt._id.toString() != question._id.toString())
                            lb.points = docs.points+10;
                        else
                            lb.points = docs.points;
                        lb.lastAttempt = question;
                        lb.save();
                        flag = true;
                    }).catch(err => console.log(err));
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        res.send({'success': flag});
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.get('/fetchLeaderboard', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        await Leaderboard.find({}).then((docs) => {
            var leaderMap = {};
                docs.forEach(doc => {
                    leaderMap[doc['_id']] = {
                        'user': doc.user,
                        'points': doc.points,
                        'lastAccepted': doc.date,
                        'lastAttempt': doc.lastAttempt
                    };
                });
                res.send({'data':leaderMap});
        }).catch((err) => {
            console.log(err);
            res.send({'error': err});
        });
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/returnQuestion', async (req, res) => { 
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        await Question.findOne({'qNo': `${req.body.qNo}`}).then((docs) => {
            res.send({'question': docs.question, 'file': docs.file});
        }).catch((err) => {
            console.log(err);
            res.send({'error': err});
        });
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/fetchUserProgress', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        await User.findOne({'enrollment': `${req.body.enrollment}`}).then(async (user)=>{
            await Leaderboard.findOne({'user': user}).then(async (lb)=>{
                await Question.findOne({'_id': lb.lastAttempt._id.toString()}).then((lastQuestion)=>{
                    res.send({'qNo': lastQuestion.qNo, 'points': lb.points});
                }).catch(err3 => {console.log(err3); res.send({'error': err3.message})});
            }).catch(err2 => {console.log(err2); res.send({'error': err2.message})});
        }).catch(err1 => {console.log(err1); res.send({'error': err1.message})});
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/matchAnswer', async(req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        await Question.findOne({'qNo': `${req.body.qNo}`}).then(async (docs) => {
            if(bcrypt.compareSync(docs.answer, `${req.body.answer}`))
            {
                res.send({'verified': true});
            }
        }).catch((err) => {
            console.log(err);
            res.send({'error': err.message});
        })
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});