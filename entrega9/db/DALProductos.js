const fs = require('fs');
const path = require("path");
const Producto = require('../entities/Producto');

class DALProductos {
    constructor(filename) {
        this.filepath = path.resolve(__dirname, `./storage/${filename}`);
    };

    read = async function () {
        try {
            
            const a = await fs.promises.readFile(this.filepath);
            const parsedData = JSON.parse(a.toString())
            const productos = parsedData.map( p => new Producto(p.id, p.name, p.price, p.thumbnail));

            return productos;

        } catch {
            return [];
        }
    }

    save = async function (product) {
        try {
            const fileContent = await this.read();
            const latestObj = fileContent.reduce((prev, curr) => {
                return (prev.id > curr.id) ?  prev : curr
            });

            const id = latestObj.id + 1;
            const exist = fileContent.filter( p => p.name === product.name);

            if (exist.length !== 0) 
                return false;
            
            const dbProduct = {
                id,
                name: product.name,
                price: product.price,
                thumbnail: product.thumbnail
            }

            fileContent.push(dbProduct)

            await fs.promises.writeFile(this.filepath, JSON.stringify(fileContent, null, '\t'))  
            return true;

        } catch(e) {
            console.log(e)
            return false;
        }
    }

    update = async function (product) {
        try {
            const fileContent = await this.read();
            const exists = fileContent.filter( p => p.id === product.id);

            if (exists.length === 0) 
                return null;
            
            fileContent.map( p => {
                if (p.id === product.id) {
                    p.name = product.name
                    p.price = product.price;
                    p.thumbnail = product.thumbnail;
                }
            });

            await fs.promises.writeFile(this.filepath, JSON.stringify(fileContent, null, '\t'))  
            return fileContent.filter( p => p.name === product.name)[0];
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    delete = async function (productId) {
       try {
        const fileContent = await this.read();
        const productToDelete = fileContent.filter( p => p.id === productId);

        if (productToDelete.length === 0) 
            return false;
        
        const editedFileContent = fileContent.filter( p => p.id !== productId);

        await fs.promises.writeFile(this.filepath, JSON.stringify(editedFileContent, null, '\t'))  
        return productToDelete[0];

       } catch(e) {
           console.log(e)
        return false
       }
    }
}

module.exports = DALProductos;