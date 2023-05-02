const express = require('express');
const cors = require('cors');
const http = require("http");
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 300, 
	standardHeaders: true,
	legacyHeaders: false,
});
var bcrypt = require('bcryptjs');
const User = require('./models/user');
const Question = require('./models/questions');
const Leaderboard = require('./models/leaderboards');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(limiter);
const server = http.createServer(app);

var salt = bcrypt.genSaltSync(10);
const port = process.env.PORT || process.env.API_PORT;

main().catch(err => console.log(err));

async function main() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to MongoDB");
        server.listen(port, () => console.log(`Listening on port ${port}`));
    }).catch((err) => console.log(`Error connecting to MongoDB: ${err}`));
    
    // const db = mongoose.connection;
    // db.on("error", console.error.bind(console, "connection error: "));
    // db.once("open", function () {
    //     console.log("Connected successfully");
    // });
}

app.get('/', (req, res) => {
    res.send({'success': 'Connected successfully'});
})

app.post('/register', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var flag = true;
        try
        {
            await User.findOne({
                'email': `${req.body.email}`
            }).then(docs => {
                if (Object.keys(docs).length > 0) {
                flag = false;
                }
            }).catch(err => console.log(err));
        }
        catch(err)
        {
            console.log(err);
        }

        if(flag)
        {
            const user = new User();
            user.enrollment = `${req.body.enrollment}`;
            user.email = `${req.body.email}`.toLowerCase();
            user.name = `${req.body.name}`;
            user.password = bcrypt.hashSync(`${req.body.password}`, salt);

            const token = jwt.sign({
                enrollment: `${req.body.enrollment}`,
                email: `${req.body.email}`.toLowerCase(),
                name: `${req.body.name}`
            }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});

            user.token = token;
            user.save();

            const q = await Question.findOne({'qNo': 0});
            const lb = new Leaderboard();
            lb.user = user;
            lb.points = 0;
            lb.lastAttempt = q;
            lb.save();
            res.send({'success': flag});
        }
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
            const token = jwt.sign({
                enrollment: `${req.body.enrollment}`,
                email: `${req.body.email}`.toLowerCase(),
                name: `${req.body.name}`
            }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});

            res.send({
                'success': true, 
                'name': name,
                'enrollment': enrollment,
                'token': token
            });
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
    if(process.env.API_ACCESS_TOKEN == `${req.query.access_token}`)
    {
        var qno = `${req.query.qno}`;
        var ques = `${req.query.question}`;
        var file = `${req.query.file}`;
        var answer = `${req.query.answer}`;
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

app.post('/updateLeaderboard', auth, async (req, res) => {
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

app.post('/fetchLeaderboard', async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        var leaderMap = {};
        await Leaderboard.find({}).sort({points: -1, date: 1}).then(async (docs) => {
            var count = 0;
                docs.forEach(async (doc) => {
                    leaderMap[count] = {
                        'user': doc.user._id.toString(),
                        'points': doc.points,
                        'lastAccepted': doc.date,
                        'lastAttempt': doc.lastAttempt._id.toString()
                    };
                    count+=1;
                });
        }).catch((err) => {
            console.log(err);
            res.send({'error': err});
        });

        for(var i=0;i<Object.keys(leaderMap).length; i++) {
            leader = leaderMap[i];
            await User.findOne({'_id':leader.user}).then((user) => {
                leader['user'] = user.name;
            }).catch((err) => {
                console.log(err);
                res.send({'error': err});
                return;
            });

            await Question.findOne({'_id': leader.lastAttempt}).then((question) => {
                leader['lastAttempt'] = question.qNo;
            }).catch((err) => {
                console.log(err);
                res.send({'error': err});
                return;
            });
        }
        setTimeout(() => {
            res.send({'data':leaderMap});
        }, 2500);
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/returnQuestion', auth, async (req, res) => { 
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

app.post('/fetchUserProgress', auth, async (req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        const user = await User.findOne({'enrollment': `${req.body.enrollment}`});
        if(user != null)
        {
            const lb = await Leaderboard.findOne({'user': user});
            if (lb != null)
            {
                const lastQuestion = await Question.findOne({'_id': lb.lastAttempt._id.toString()});
                if(lastQuestion != null)
                {
                    res.send({'qNo': lastQuestion.qNo, 'points': lb.points});
                }
                else
                {
                    res.send({'error': 'Question not found!'});
                }
            }
            else
            {
                res.send({'error': 'Leaderboard is not updated!'});
            }
        }
        else
        {
            res.send({'error': 'User does not exist!'});
        }
    }
    else
    {
        res.send({'access_error': 'Illegal Operation'});
    }
});

app.post('/matchAnswer', auth, async(req, res) => {
    if(process.env.API_ACCESS_TOKEN == `${req.body.access_token}`)
    {
        await Question.findOne({'qNo': `${req.body.qNo}`}).then(async (docs) => {
            if(bcrypt.compareSync(`${req.body.answer}`, docs.answer))
            {
                res.send({'verified': true});
            }
            else
            {
                res.send({'verified': false});
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