var express=require("express");
var bodyparser=require("body-parser");

var app=express();

var todo_db=require("./seed.js");
console.log(todo_db);

//serve static assets in public directory
app.use("/",express.static(__dirname+"/public"));
//app.use("/",bodyparser.urlencoded({extended:false}));

app.use("/",bodyparser.urlencoded({extended:false}));
//what all interactions
//1.get all todos
//2.add a todo
//3.complete
//4.delete

//handling end points
// get all todos
//http://localhost:4000?todos/get
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
app.get("/api/todos",function (req,res) {
    res.json(todo_db.todos);

});
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//delete a id
app.delete("/api/todos/:id",function (req,res) {
    var del_id= req.params.id;
    var todo=todo_db.todos[del_id];
    //if this todo_doesnot_exist

    if(!todo) {
        res.status(400).json({error:"ToDo doesn't exist"});
    }
     else{todo.status=todo_db.statusENUMS.DELETED;
        res.json(todo_db.todos);

    }

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

});
 app.post("/api/todos",function (req,res) {
     var todo=req.body.todos_title;

     if(!todo||todo==""||todo.trim()=="") {
         res.status(400).json({error:"ToDo doesn't exist"});
     }
  else
     {
         var new_todo_object={
             title:req.body.todos_title,
             status: todo_db.statusENUMS.ACTIVE}
     }
     todo_db.todos[todo_db.next_todo_id++]=new_todo_object;
     res.json(todo_db.todos);
 });

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

app.put("/api/delet/:id",function (req,res) {
    var dele_id =req.params.id;
    if(dele_id<todo_db.next_todo_id){
        delete todo_db.todos[dele_id];
    }
    else
    {
        res.status(400).json({error:"Please enter valid id"});
    }

res.json(todo_db.todos);

})
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
 app.put("/api/todos/:id",function (req,res) {
     var mod_id= req.params.id;
     var todo=todo_db.todos[mod_id];
     //if this todo doesnot exist


     if(!todo){
         res.status(400).json({error:"ToDO doesn't exist"});
     }
     else{
         var todo_title=req.body.todo_title;

         if(todo_title&&todo_title!=""&&todo_title.trim()!="")
         {
             console.log('test here' + todo_title);
             todo.title=todo_title;
         }
     }



     var todo_status=req.body.todo_status;
     //if(todo_status.trim()!=""||todo_status==""){
         if(todo_status&&(todo_status==todo_db.statusENUMS.ACTIVE||todo_status==todo_db.statusENUMS.COMPLETE)){
         todo.status=todo_status;

     }
     else {
         res.status(400).json({error:"Palease enter valid status"});
     }


     res.json(todo_db.todos);


 });
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
//;;; Assignments;;;;;;;;;;;Assignments;;;;;;;;;;;;;;;Assignments;;;;;;;;;;;;;;;;Assignments;;;;;;;;;Assignments;;;;;;;;

app.get("/api/todos/active",function (req,res) {
    var a=[];
    for(var i=1;i<todo_db.next_todo_id;i++)
    {
        if(todo_db.todos[i].status=="ACTIVE")
        {
            a.push(todo_db.todos[i]);
        }
    }
    if(a.length==0)
        res.status(400).json({error:"There is no element with complete status "});
    res.json(a);
})

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
app.get("/api/todos/complete",function (req,res) {
    /*var a=[];
    for(var i in todo_db.todos)
    {
        if(i.status=="COMPLETE")
            a.push(i);
    }
    if(a.length==0)
        res.status(400).json({error:"There is no element with complete status "});
    res.json(a);*/
    var a=[];
    for(var i=1;i<todo_db.next_todo_id;i++)
    {
        if(todo_db.todos[i].status=="COMPLETE")
        {
            a.push(todo_db.todos[i]);
        }
    }
    if(a.length==0)
        res.status(400).json({error:"There is no element with complete status "});
    res.json(a);
})

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

app.get("/api/todos/deleted",function (req,res) {
    var a=[];
    for(var i=1;i<todo_db.next_todo_id;i++)
    {
        if(todo_db.todos[i].status=="DELETED")
        {
            a.push(todo_db.todos[i]);
        }
    }
    if(a.length==0)
        res.status(400).json({error:"There is no element with delete status "});
    res.json(a);

})
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
app.put("/api/todos/complete/:id",function (req,res) {
    var status_id=req.params.id;
    if(status_id>=todo_db.next_todo_id)
        res.status(400).json({error:"Please enter valid id"});
    todo_db.todos[status_id].status="COMPLETE";
    res.json(todo_db.todos);

})

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
app.put("/api/todos/active/:id",function (req,res) {
    var status_id=req.params.id;
    if(status_id>=todo_db.next_todo_id)
        res.status(400).json({error:"Please enter valid id"});
    todo_db.todos[status_id].status="ACTIVE";
    res.json(todo_db.todos);

})

app.listen(4000);
