var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var { validate, v4 } = require('uuid');
var matches = [{
        match: "Game one",
        team1: "italia",
        team2: "francia",
        result: "2-0",
        time: "68°",
        overgoal: 6


    },
    {
        match: "Game two",
        team1: "bulgaria",
        team2: "germania",
        result: "1-0",
        time: "30°",
        overgoal: 3
    },
    {
        match: "Game three",
        team1: "italia",
        team2: "germania",
        result: "4-2",
        time: "10°",
        overgoal: 3
    },
    {
        match: "Game four",
        team1: "bulgaria",
        team2: "francia",
        result: "1-0",
        time: "08°",
        overgoal: 1


    },
]

matches = matches.map((item) => {
    return {...item, id: v4() }
})


app.get('/matches', (req, res) => {


    if (req.query.team1) {

        var filteredName = matches.filter(item => item.team1.toLowerCase() === req.query.team1.toLowerCase());
        return res.json(filteredName);
    } else if (req.query.team2) {
        var filteredName = matches.filter(item => item.team2.toLowerCase() === req.query.team2.toLowerCase());
        return res.json(filteredName);

    } else if (req.query.overgoal) {
        var number = req.query.overgoal;
        if (isNaN(number)) {
            res.status(404).json({ message: 'there is not a number' });
        } else {
            var filteredovergoal = matches.filter(item => item.overgoal >= req.query.overgoal);
            return res.json(filteredovergoal);
        }
    } else {
        res.json(matches)
    }
});
app.get('/matches/:id', (req, res) => {
    var id = req.params.id;
    if (validate(id)) {
        let searchId = matches.find((item) => item.id === id);

        if (searchId == undefined) {
            res.status(404).json({ message: 'there is no match with this id' })

        } else {
            res.json(searchId)
        }
    } else {
        res.status(400).json({ message: 'id not validate' })
    }
});

app.put('/matches/:id', (req, res) => {
    var id = req.params.id;
    if (validate(id)) {
        var index = matches.findIndex(item => item.id === id);

        if (index == -1) {
            res.status(404).json({ message: "there is no match with this id" });
        } else {
            matches[index].result = req.body.result;
            res.status(200).json(matches[index]);
        }
    } else {
        res.status(400).json({ message: "id not valid" });
    }
});

app.delete('/matches/:id', (req, res) => {
    var id = req.params.id;
    if (validate(id)) {
        var index = matches.findIndex(item => item.id === id);
        if (index == -1) {
            res.status(404).json({ message: "there is no match with this id" });
        } else {
            matches.splice(index, 1);
            return res.status(200).json(matches);
        }
    } else {
        res.status(400).json({ message: "id not valid" });
    }
})


app.post('/matches', (req, res) => {
    var add = req.body;
    add.id = v4();
    matches.push(add);
    res.status(201).json(add);
});
app.listen(3100);