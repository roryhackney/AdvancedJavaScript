import mongoose from 'mongoose';
import * as connector from '../connector.js';

const {Schema} = mongoose;

mongoose.connect(connector.connectionString, {
    dbName: connector.dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
    console.log('Mongoose connected.');
});

const dinoSchema = new Schema({
    name: {type: String, required: true},
    length: {type: String, required: true},
    weight: {type: String, required: true},
    
    cool: {type: Number, required: true,
        max: [5, 'Scale is 1-5'],
        min: [1, 'Scale is 1-5'],
        validate: { validator: Number.isInteger,
                    message: 'Whole numbers only.'}
    }
});

dinoSchema.methods.prefix = function() {
    this.name = 'Cool ' + this.name;
    return this.name;
};

const Dinosaur = mongoose.model('Dinosaur', dinoSchema);
export {Dinosaur};