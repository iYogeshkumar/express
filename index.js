const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.urlencoded({ extended: true}));
app.use(express.json());


app.post("/",(req, res)=>{
    const datafromclient=req.body;
    fs.readFile("./data.json",{ encoding: "utf-8"}, (err, data)=>{
        if (err){
            console.log("error reading file");
        }
        const parsedData = JSON.parse(data);
        parsedData.todos = [...parsedData.todos,datafromclient]

        fs.writeFile("./data.json",JSON.stringify(parsedData), {encoding: "utf-8"},(err, data)=>{
            if (err){
                res.send("error occured")
            }
            res.send("message added/stored successfully")
    })

    })

})

app.get("/",(req, res)=>{
    fs.readFile("./data.json", { encoding: "utf-8"}, (err, data)=>{
        if(err) {
            res.send("error");
        }
        const parsedData = JSON.parse(data)
        const todos = parsedData.todos
        res.send(JSON.stringify(todos))
    });
})

app.delete("/:id", (req, res) => {
    const id = Number(req.params.id)

    fs.readFile("./data.json", { encoding: "utf-8"}, (err, data)=>{
        const parsedData = JSON.parse(data)

        const todos = parsedData.todos
        const remainingtodos = todos.filter((todo) => todo.id!==id)

        parsedData.todos = remainingtodos

        fs.writeFile("./data.json", JSON.stringify(parsedData), { encoding: "utf-8"},()=>{
            res.send(`todo ${id} was deleted`)
        })
    })
})

app.put('/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./data.json', { encoding: 'utf-8' }, (err, data) => {

      const parsed = JSON.parse(data);
      parsed.todos = parsed.todos.map((el) => (el.id == id ? req.body : el));
      fs.writeFile(
        './data.json',
        JSON.stringify(parsed),
        'utf-8',
        (err,data) => {
            if (err) {
                console.log("error while writing");
            }

          res.send('todo sucessfully replaced');
        },
      );
    });
  });

  const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log("listening to server...on port 8000");
})