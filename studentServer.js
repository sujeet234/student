let express=require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
});
//process.env.PORT ||
const port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}`));

let students=[
    { id: 1, name: "Jack", course: "React", grade: "A", city: "London" },
    { id: 2, name: "Tim", course: "Node", grade: "A", city: "Paris" },
    { id: 3, name: "Anna", course: "JS", grade: "B", city: "London" },
    { id: 4, name: "Bob", course: "Angular", grade: "B", city: "Mumbai" },
    { id: 5, name: "Mary", course: "React", grade: "A", city: "Tokyo" },
    { id: 6, name: "Steve", course: "React", grade: "B", city: "London" },
    { id: 7, name: "Kathy", course: "Node", grade: "C", city: "Tokyo" },
    { id: 8, name: "Vivian", course: "Node", grade: "D", city: "Mumbai" },
    { id: 9, name: "Edwards", course: "JS", grade: "D", city: "Mumbai" },
    { id: 10, name: "George", course: "JS", grade: "C", city: "Tokyo" },
    { id: 11, name: "Sam", course: "Angular", grade: "B", city: "Paris" },
    { id: 12, name: "Amy", course: "Angular", grade: "A", city: "Paris" },
    { id: 13, name: "Jill", course: "JS", grade: "A", city: "Tokyo" },
    { id: 14, name: "Duke", course: "JS", grade: "B", city: "Mumbai" },
    { id: 15, name: "Anita", course: "JS", grade: "B", city: "Paris" },
    { id: 16, name: "Mike", course: "React", grade: "C", city: "London" },
    { id: 17, name: "Teddy", course: "Node", grade: "C", city: "Tokyo" },
    { id: 18, name: "Charles", course: "JS", grade: "D", city: "Mumbai" },
    { id: 19, name: "Bill", course: "Node", grade: "D", city: "London" },
    { id: 20, name: "Carla", course: "React", grade: "D", city: "Tokyo" },
    { id: 21, name: "Joanna", course: "JS", grade: "A", city: "Paris" },
    { id: 22, name: "Pam", course: "JS", grade: "B", city: "Paris" },
];

let fs = require("fs");
let fname = "students.json";

app.get("/svr/resetData",function(req,res){
    let data = JSON.stringify(students);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    });
})

app.get("/svr/students",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            res.send(studentsArray);
        }
    })
})

app.get("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let student = studentsArray.find((st)=>st.id===id);
            if(student) res.send(student);
            else res.status(404).send("No student Found");
        }
    })
})

app.get("/svr/students/course/:name",function(req,res){
    let name = req.params.name;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let student = studentsArray.filter((st)=>st.course===name);
            if(student) res.send(student);
            else res.status(404).send("No student Found");
        }
    })
})

app.post("/svr/students",function(req,res){
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let maxId = studentsArray.reduce((ele,curr)=>curr.id>ele ? curr.id : ele,0);
            let newId = maxId+1;
            let newStudent = {...body,id:newId};
            studentsArray.push(newStudent);
            let data1 = JSON.stringify(studentsArray);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(newStudent)
            })
        }
    })
})

app.put("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let index = studentsArray.findIndex((st)=>st.id===id);
            if(index>=0){
                let updateStudent = {...studentsArray[index], ...body};
                studentsArray[index] = updateStudent;
                let data1 = JSON.stringify(studentsArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updateStudent);
                })
            }
            else res.status(404).send("No student found");
        }
    });
})
app.delete("/svr/students/:id",function(req,res){
    let id = +req.params.id;
    let body = req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err) res.status(404).send(err);
        else{
            let studentsArray = JSON.parse(data);
            let index = studentsArray.findIndex((st)=>st.id===id);
            if(index>=0){
                let deleteStudent = studentsArray.splice(index,1);
                let data1 = JSON.stringify(studentsArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(deleteStudent);
                })
            }
            else res.status(404).send("No student found");
        }
    });
})


