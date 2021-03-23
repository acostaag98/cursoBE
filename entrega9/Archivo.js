const fs = require('fs');
const Producto = require('./producto.js');


class Archivo {
    constructor(name) {
        this.name = name;
    }
    read = async function () {
        try{
            const a = await fs.promises.readFile(this.name);
            const parsedData = JSON.parse(a.toString())
            const productos = parsedData.map(d => new Producto(d.id, d.nombre, d.precio, d.linkFoto));
            return productos
        }
        catch{
            return 'ups, algo salio mal en el read';
        }
    }

    save = async function () {
        try{
            if (!data) {
                return 'Hola, te rompio aca el programa';
            }
    
            let fileContent = await this.read().then(d => d);
            const id = fileContent.length + 1;
            const product = {
                id,
                titulo: data.titulo,
                precio: data.precio,
                linkFoto: data.linkFoto
            }

            fileContent.push(product)

            await fs.promises.writeFile(this.name, JSON.stringify(fileContent, null, '\t'))  
            return 'Se guardo correctamente';

        } catch {
            return 'upsss algo salio como anoche en el save'
            }
    }

    delete = async function () {
        try {
            await fs.promises.unlink(this.name)
            return 'borra2';
    
           } catch {
            return `ups algo salio mal en el delete`;
           }
    }
}

module.exports = Archivo;