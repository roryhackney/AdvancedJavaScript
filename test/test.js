import {expect} from 'chai';
import * as dino from '../data.js';

describe("Get Dino Module", () => {
    it("returns the requested item", () => {
        let result = dino.getItem("stegosaurus");
        expect(result).to.deep.equal({name: "stegosaurus", length: "21 feet",
        weight: "7 tons",
        cool: 4});
    });
    it("fails with invalid item", () => {
        let result = dino.getItem("Avocado");
        expect(result).to.be.undefined;
    });

});

describe("Delete Dino Module", () => {
    it("deleted the requested item", () => {
        dino.deleteItem("stegosaurus");
        expect(dino.getItem("stegosaurus")).to.be.undefined;
    });

    it("returns error if the item doesn't exist", () => {
        let result = dino.deleteItem("avocado");
        expect(result).to.equal("Error: avocado does not exist.");
    });
});

describe("Add Dino Module", () => {
    it("added the requested item", () => {
        let result = dino.addItem("avocado", "2 inches", ".25 pounds", 1);
        expect(result).to.equal("avocado has been successfully added.");
    });

    it("returns error with bad data", () => {
        let result = dino.addItem();
        expect(result).to.equal("Please enter a name, length with unit, weight with unit, and rating (1-5)\nExample: addItem('Pterodactyl', '13 feet', '88 pounds', 5);");
    });
});

