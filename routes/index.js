var express = require('express');
var router = express.Router();

//INCLUDE THE MONGOOSE MODEL FOR THE TASK LIST
var Task = require('../Models/Task');

//READ
router.get('/', function(req, res, next) {
    //INITIALIZE VARIABLES SUCH AS THE TASKS OBJECT
    var tasks = []; // THIS IS AN EMPTY JSON OBJECT
    var tasksInOrder = [];  // THIS IS WHERE WE WILL STORE THE
                            // ORDERED TASKS
    //GET THE TASKS
    Task.find(function(err, tasks){
        if(err){
            console.log(err);
            res.render('error', {message: "Could not get tasks", error: err});
        }else{
            //SINCE THIS FUNCTION IS ASYNC, NEEDS **this** OPERAND
            this.tasks = tasks;
            //CALL THE NEXT FUNCTION -- EITHER USE THE GLOBAL
            //VARIABLE OR PASS 'tasks' THROUGH
            rearrangeTasks();
        }
    });

    function rearrangeTasks() {
        //LOOP THROUGH EVERY TASK FROM DB
        for(var i = 0; i < this.tasks.length; i++){
            //STORE THE TASKS IN THE RIGHT POSITIONS
            tasksInOrder[this.tasks[i].position] = this.tasks[i]; // TASKS AT POSITION = TASK
            //SEND THROUGH THE REARRANGED TASK LIST
        }

        res.render('index', { title: 'Drag and Drop', tasks: tasksInOrder });
    }
});

//CREATE
router.post('/', function(req, res, next){
    //INITIALIZE VARIABLES SUCH AS THE NEW TASK
    var position = 0;

    //GET THE LAST POSITION OF THE TASKS
    Task.find(function(err, tasks){
        if(err){
            console.log(err);
            res.render('error', {message: "Could not get tasks", error: err});
        }else{
            //THE LAST POSITION WILL BE THE LENGTH OF THE TASKS IN DB
            this.position = tasks.length;
            //CALL ANOTHER FUNCTION TO KEEP IT SYNCHRONOUS
            addTask();
        }
    });

    //ADD THE TASK WITH THE POSITION RETRIEVED
    function addTask(){
        var task = new Task({ title: req.body.title, date: req.body.date, position: this.position });
        task.save(function(err){
            if(err){
                console.log(err);
                res.render('error', {message: "Could not get tasks", error: err});
            }else{
                //REDIRECT UPDATING THE LIST
                res.redirect('/');
            }
        });
    }
});

//DELETE
router.get('/delete/:id', function(req, res, next){
    // WE NEED TO GET THE POSITION OF THE TASK BEING DELETED AND UPDATE THE TASKS WITH
    // POSITIONS GREATER THAN CURRENT ONE

    //INITIALIZE LIST OF TASKS AS LOCAL VARIABLE
    var tasks = [];
    //GET THE ID OF THE TASK BEING DELETED
    var id = req.params.id;

    //GET THE CURRENT TASKS
    Task.find(function(err, tasks){
        if(err) {
            console.log(err);
            res.render('error', {message: "Could not get tasks", error: err });
        }else{
            this.tasks = tasks;
            deleteTask();
        }
    });

    //THIS FUCNTION WILL GO THROUGH THE LIST OF TASKS AND DELETE THE TASK AT POSITION GIVEN
    function deleteTask(){
        //DECLARE THE VARIABLE FOR THE POSITION OF THE TASK TO BE REMOVED
        var position;
        //LOOP THROUGH, GET POSITION, SPLICE FROM LIST
        for(var i = 0; i < this.tasks.length; i++){
            if(this.tasks[i]._id == id){
                position = this.tasks[i].position;
                this.tasks.splice(tasks[i], 1);
            }
        }

        //REMOVE THE ITEM FROM TASK LIST
        //IT IS ASYNC, NO WORRIES
        Task.remove({_id: id}, function(err){
            if(err) {
                console.log(err);
                res.render('error', {message: "Could not update tasks", error: err});
            }
        });

        //LOOP THROUGH, UPDATE THE TASKS WITH POSITION GREATER THAN DELETED
        for(var i = 0; i < this.tasks.length; i++){
            //IF THE POSITION IS GREATER THAN THE ONE DELETED
            if(this.tasks[i].position > position){

                //SUBTRACT ONE FROM THE POSITION TO MAKE UP FOR THE MISSING ONE
                var newPos = this.tasks[i].position - 1;

                //UPDATE EACH TASK
                Task.update({_id: this.tasks[i]._id }, { position: newPos }, function(err){
                    if(err){
                        console.log(err);
                        res.render('error', {message: "Could not update tasks", error: err});
                    }
                });
            }
        }

        //REDIRECT TO /
        res.redirect('/');
    }
});

//UPDATE
router.post('/rearrange', function(req, res, next){
    //GET THE OBJECT PASSED IN THROUGH JQUERY
    var tasksInOrder = req.body;

    console.log(tasksInOrder);

    //LOOP THROUGH THE TASKS SENT BY THE PAGE
    for(var i = 0; i < tasksInOrder.length; i++){
        Task.update({ _id: tasksInOrder[i].id }, { position: i }, function(err){
            if(err){
                console.log(err);
                res.render('error', {message: "Could not update tasks", error: err});
            }
        });
    }
});

module.exports = router;
