const express = require('express')
const app = express()
const fs = require('fs');

let contadorItems = 0
let contadorItemRandom = 0


class Archivo {
    constructor(name) {
        this.name = name;
    }
    read = async function () {
        try {
            const a = await fs.promises.readFile(this.name);
            const parsedData = JSON.parse(a.toString())
            return parsedData;

        } catch {
            return [];
        }
    }

    save = async function (data) {
        try {
            if (!data) {
                throw new Error();
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
            return 'upsss algo salio como anoche'
        }
    }

    delete = async function () {
       try {
        await fs.promises.unlink(this.name)
        return 'Deleted!';

       } catch {
        return `Something went wrong trying to delete the file named ${this.name}...`;
       }
    }
}

app.get('/', (req, res) => {

    res.send('desde express')

}) //get recibe la ruta y el req (es la peticion, es lo que ami me llega del servidor),res es basicamente la rta

app.get('/items', async(req, res) => {
    try {
        const db = new Archivo('productos.js');
        const items =  await db.read();
        contadorItems += 1

        const data = {
            items,
        };

        res.json(data);

    } catch (err) {
        return 'upss algo te salio mal en el /items'
    }
});

app.get('/item-random', async(req, res) => {
    try {
        const db = new Archivo('productos.js');
        const items =  await db.read();
        contadorItemRandom += 1
        if (items.length > 0) {
            id_random = Math.floor(Math.random() * items.length),
            itemRandom = items[id_random]
            res.json(itemRandom)
        }
        else{
            return 'No hay items!'
        }
    }
    catch {
        return 'upss algo salio mal en el item-random'
    }
});

app.get('/visitas', async(req, res) => {
    try {
        
        const visitas = { 
            items: contadorItems,
            item: contadorItemRandom,
        }
        res.json(visitas)
    }
    catch  {
        return 'Algo salio mal en el visitas panita'
    }
});

app.listen(3008, () => {
    console.log('Running')
})