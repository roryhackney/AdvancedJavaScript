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
        return "Error: Please provide the name of the item to be deleted.";
    }
    if(typeof dinoname !== 'string'){
        return "Error: Please enter a string.";
    }
    let myDino= getItem(dinoname);
    if(myDino===undefined){
        return "Error: " + dinoname + " does not exist.";
    }
    let index = dinos.indexOf(myDino);
    dinos.splice(index, 1);
    return dinoname + " has been successfully deleted.";
};

let addItem = (dinoname, length, weight, cool) => {
    if(typeof dinoname !== 'string' || typeof length !== 'string' || typeof weight !== 'string' || typeof cool !== 'number'){
        return "Please enter a name, length with unit, weight with unit, and rating (1-5)" +
        "\nExample: addItem('Pterodactyl', '13 feet', '88 pounds', 5);";
    }
    let found = getItem(dinoname);
    if(found !== undefined){
        return dinoname + ' already exists.';
    }
    let myObj = {"name": dinoname.toLowerCase(), "length": length.toLowerCase(), "weight": weight.toLowerCase(), "cool": cool};
    dinos.push(myObj);
    return dinoname.toLowerCase() + ' has been successfully added.';
};