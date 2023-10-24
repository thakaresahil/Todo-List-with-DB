import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");

const newItemSchema = {
    listItem: String
};

const Item = mongoose.model('Item', newItemSchema);

const item1 = new Item({
    listItem: "Work On Yourself"
});

const item2 = new Item({
    listItem: "Get Hold of Yourself"
});

const defaultItem = [item1, item2];

// Item.insertMany(defaultItem);

app.get('/',async (req, res) => {
    
    const arr = await Item.find({});
    if(arr.length===0){
        Item.insertMany(defaultItem);
        res.redirect("/");
    }
    else{
        res.render("index.ejs",{list: arr})
    }
});

app.post('/add', (req, res) => {
    const itemName = req.body.wItem;

    const item = new Item({
        listItem: itemName
    })
    item.save();
    res.redirect("/");

});

app.post("/delete",async (req, res) => {
    const checkedItem = req.body.checkbox;
   await Item.findByIdAndRemove(checkedItem);
    res.redirect("/");
});

app.get("/:customListName",function(req, res) {
    res.send("Action not allowed");
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
}); 