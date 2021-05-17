import { Dinosaur } from "./models/Dinosaur.js";

export {getAll, getItem, deleteItem, addItem};

/*TESTING JOI DATA VALIDATION
import Joi from 'joi';
const schema = Joi.object().keys({
    name: Joi.string().required(),
    length: Joi.string().required(),
    weight: Joi.string().required(),
    cool: Joi.number().integer().min(1).max(5).required()
});

let badData = {name: 'bam', length: 1, weight: '1', cool: 6};
const {error, value} = schema.validate(badData);
console.log(error);
console.log(value);
*/

let dinos = [
    {"name": "tyrannosaurus rex",
    "length": "43 feet",
    "weight": "7.5 tons",
    "cool": 5},
    {"name": "triceratops",
    "length": "26 feet",
    "weight": "12 tons",
    "cool": 2},
    {"name": "velociraptor",
    "length": "6 feet",
    "weight": "33 pounds",
    "cool": 3},
    {"name": "stegosaurus",
    "length": "21 feet",
    "weight": "7 tons",
    "cool": 4},
    {"name": "chicken",
    "length": "1.5 feet",
    "weight": "5 pounds",
    "cool": 1}
];

let getAll = () => dinos;

let getItem = dinoname => {
    let found = dinos.find(dino => {return dino.name===dinoname.toLowerCase()});
    return found;
};

let deleteItem = dinoname => {
    if(dinoname===undefined){
        return {"success": false, "message":"Please provide the name of the item to be deleted."};
    }
    if(typeof dinoname !== 'string'){
        return {"success": false, "message":"Please enter a string."};
    }
    let myDino= getItem(dinoname);
    if(myDino===undefined){
        return {"success": false, "message": "Error: " + dinoname + " does not exist."};
    }
    let index = dinos.indexOf(myDino);
    dinos.splice(index, 1);
    return {"success": true, "message": dinoname + " has been successfully deleted."};
};

let addItem = (dinoname, length, weight, cool) => {
    if(typeof dinoname !== 'string' || typeof length !== 'string' || typeof weight !== 'string' || typeof cool !== 'number'){
        return {"success": false, "message": "Please enter a name, length with unit, weight with unit, and rating (1-5)" +
        "\nExample: addItem('Pterodactyl', '13 feet', '88 pounds', 5);"};
    }
    let found = getItem(dinoname);
    if(found !== undefined){
        return {"success": false, "message": dinoname + ' already exists.'};
    }
    let myObj = {"name": dinoname.toLowerCase(), "length": length.toLowerCase(), "weight": weight.toLowerCase(), "cool": cool};
    dinos.push(myObj);
    return {"success": true, "message": dinoname.toLowerCase() + ' has been successfully added.'};
};

//test data - added to DB
// let ptero= {"name": "pterodactyl", "length":"13 feet", "weight": "88 pounds", "cool": 5};
// let iguan = {"name":"iguanadon", "length":"30 feet", "weight": "4 tons", "cool": 2};
// let bronto = {"name": "brontosaurus", "length": "72 feet", "weight": "17 tons", "cool": 4};
// let gall = {"name":"gallimimus", "length":"19 feet", "weight": ".5 ton", "cool": 5};
// let mosa = {"name":"mosasaurus", "length": "55 feet", "weight":"15 tons", "cool": 5};
// let rap = {"name":"raptorex", "length":"9 feet", "weight":"150 pounds", "cool":4};
// let co = {"name":"coelophysis", "length":"9 feet", "weight":"40 pounds", "cool": 3};
// let ank = {"name":"ankylosaurus", "length":"35 feet", "weight": "4 tons", "cool": 4};
