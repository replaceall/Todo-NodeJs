console.log("is script file Loading");

const RESPONSE_DONE=4;
const STATUS_OK=200;
var data;
var dody_data;
const ID ="todos_list_div";
const  CID="to_complete";
const DID="to_delete";

//diff between documentonload and window onload


window.onload=getTodoAJAX();

function  change_hidden_status(hidden) {
    var x=document.getElementById(hidden);
    if(x.style.display==="none"){
        x.style.display='block';
        //document.getElementById(id).innerText="Hidden Todos";

    }else {
        x.style.display = "none";
    }
}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function add_todo_elements(id,todos_data_json) {

    var todos=JSON.parse(todos_data_json);
    var parent=document.getElementById(id);
    parent.innerHTML='';
    if(parent)
    {
      Object.keys(todos).forEach(function (key) {
          if(todos[key].status=="ACTIVE") {
            var todo_element = createtodoelement(key, todos[key]);
            parent.appendChild( todo_element);
          }
      })
    }
  // getTodoAJAX();
}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function addto_complete(id,todos_data_json) {
    var todos=JSON.parse(todos_data_json);
    var parent=document.getElementById(id);
    parent.innerHTML=" ";
    if(parent)
    {
        Object.keys(todos).forEach(function (key) {
            if(todos[key].status=="COMPLETE")
            {
                var todo_element=createtodoelement(key,todos[key]);
                parent.appendChild(todo_element);
                add_todo_elements(ID,todos_data_json);
            }
        })
    }

}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
function addto_delete(id,todos_data_json) {
    var todos=JSON.parse(todos_data_json);
    var parent=document.getElementById(id);
    parent.innerHTML="";
    if(parent)
    {
        Object.keys(todos).forEach(function (key) {
            if(todos[key].status=="DELETED")
            {
                var todo_element=createtodoelement(key,todos[key]);
                parent.appendChild(todo_element);
                add_todo_elements(ID,todos_data_json);
                addto_complete("to_complete",todos_data_json);
            }
        })
    }

}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function createtodoelement(key, todo_object) {
    var todo_element = document.createElement("div");
    todo_element.innerText=todo_object.title;
    todo_element.setAttribute("id", key);

    todo_element.setAttribute("class", "todoStatus_"+todo_object.status);

    if (todo_object.status=="ACTIVE"){
        var complete_button=document.createElement("input");
       // complete_button.innerText="Mark as Complete";
        complete_button.type="checkbox";
        complete_button.setAttribute("id","complete_button");
        complete_button.setAttribute("onchange","complete_todo_AJAX("+ key +")");
        complete_button.setAttribute("class","breathHorizontal");
        complete_button.setAttribute("class","breathVertical");


        var delete_button=document.createElement("button");
        delete_button.innerText="X";
        delete_button.setAttribute('id','fixed');
        delete_button.setAttribute("onclick","Delete_todo_AJAX("+key+")");
        delete_button.setAttribute("class","breathVertical");
        delete_button.setAttribute("class","breathHorizontal");

        todo_element.appendChild(complete_button);
        todo_element.appendChild(delete_button);
    }
    else if (todo_object.status == "COMPLETE")
    {
        var complete_button = document.createElement("input");
        complete_button.type = "checkbox";
        complete_button.setAttribute("id","complete_button");
        complete_button.setAttribute("checked",'');
        complete_button.setAttribute("onchange","activeTodoAJAX("+key+")");
        todo_element.appendChild(complete_button);

        var delete_button=document.createElement("button");
        delete_button.innerText="X";
        delete_button.setAttribute('id','fixed');
        delete_button.setAttribute("onclick","Delete_todo_AJAX("+key+")");
        delete_button.setAttribute("class","breathVertical");
        delete_button.setAttribute("class","breathHorizontal");

       // todo_element.appendChild(complete_button);
        todo_element.appendChild(delete_button);

    }
    return todo_element;


}

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
function activeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT','/api/todos/'+id,true);
    xhr.setRequestHeader("Content-type",'application/x-www-form-urlencoded');
    var data = 'todo_status=ACTIVE';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == RESPONSE_DONE){
            if (xhr.status == STATUS_OK){
                //add_todo_elements(ID,xhr.responseText);
                getTodoAJAX();
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send(data);
}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
function addtodoAJAX()
{
    var title=document.getElementById('new_todo_input').value;
  // title='';

     var xhr=new XMLHttpRequest();
     xhr.open("POST","/api/todos",true);
     xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

     var data="todos_title="+encodeURI(title);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==RESPONSE_DONE){
            if(xhr.status==STATUS_OK) {
                add_todo_elements(ID, xhr.responseText);
            }
            else
                console.log(xhr.responseText);
        }
    }
     xhr.send(data);
}


//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

 function getTodoAJAX(){

    console.log("something");
     //AJAx - xmlhttp request object

     var xhr=new XMLHttpRequest();
     xhr.open("GET","/api/todos",true);
     xhr.onreadystatechange=function () {
         if(xhr.readyState==RESPONSE_DONE){

             if(xhr.status==STATUS_OK){

                 console.log(xhr.responseText);

                 add_todo_elements(ID, xhr.responseText);
                 addto_complete("to_complete",xhr.responseText);
                 addto_delete("to_delete",xhr.responseText);
             }

         }
     } //end of call back

    xhr.send(data==null);



 }
 //;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
function complete_todo_AJAX(key){
     console.log('KEY: ' +key);

     var xhr=new XMLHttpRequest();
     xhr.open("PUT","/api/todos/"+key,true);
     xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
     var data="todo_status=COMPLETE";
     xhr.onreadystatechange=function () {
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                //addto_complete(CID,xhr.responseText);
                getTodoAJAX();
            }
            else{
                console.log(xhr.responseText);
            }
        }
    }
            xhr.send(data);
}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
function  Delete_todo_AJAX(key) {
    var xhr=new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+key,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var data="todo_status=DELETED";
    xhr.onreadystatechange=function () {
        if(xhr.readyState==RESPONSE_DONE)
        {
            if(xhr.status==STATUS_OK)
            {
                //add_todo_elements(ID,xhr.responseText);
                addto_delete("to_delete",xhr.responseText);
            }
            else
                console.log(xhr.responseText);
        }
    }
   xhr.send(data);

}
//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
