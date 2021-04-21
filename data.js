export {getAll, getItem};
import qs from 'qs';

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
]

let getAll = () => JSON.stringify(dinos);

let getItem = urlpath => {
    let url = urlpath.split("?");
    let query = qs.parse(url[1]);
    let found = dinos.find(dino => {return dino.name===query.name});
    return JSON.stringify(found);
}