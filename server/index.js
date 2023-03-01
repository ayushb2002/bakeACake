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
    var flag = true;
    await User.findOne({
        'email': `${req.query.email}`
    }).then(docs => {
        if (Object.keys(docs).length > 0) {
        flag = false;
        }
    }).catch(err => console.log(err));

    if(flag)
    {
        const user = new User();
        user.enrollment = `${req.query.enrollment}`;
        user.email = `${req.query.email}`;
        user.name = `${req.query.name}`;
        user.password = bcrypt.hashSync(`${req.query.password}`, salt);
        user.save();
    }
    res.send({'success': flag});
});

app.post('/login', async (req, res) => {
    var flag = false;
    await User.findOne({
        'email': `${req.query.email}`
    }).then((docs) => {
        if(bcrypt.compareSync(`${req.query.password}`, docs.password))
        {
            flag = true;
        }
    }).catch((err) => {
        console.log(err);
    });
    res.send({'success': flag});
});

app.post('/question', async (req, res) => {
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
        quest.answer = answer;
        quest.save();
        flag = true;
    }
    catch(err)
    {
        console.log(err);
        flag = false;
    }

    res.send({'success': flag});
});

app.post('/leaderboard', async (req, res) => {
    var flag = false;
    var points = 10;
    var lastQ = 1;
    const user = await User.findOne({'enrollment': `${req.query.enrollment}`});
    if(user)
    {
        await Leaderboard.findOne({
            'user': user
        }).then((docs) =>
        {
            if(docs == undefined)
            {
                const lb = new Leaderboard();
                lb.user = user;
                lb.points = points;
                lb.lastAttempt = lastQ;
                lb.save();
                flag = true;
            }
            else if(Object.keys(docs).length > 0)
            {
                points = docs.points;
                lastQ = docs.lastAttempt;
                Leaderboard.updateOne({'user': user}, {$set: {'points': points+10, 'lastAttempt': lastQ+1}});
                flag = true;
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    
    res.send({'success': flag});
})