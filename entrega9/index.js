const express = require('express');
const Archivo = require('./Archivo.js')
const Producto = require('./producto.js');
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());

const server = app.listen(port, () => {
    console.log('corrien2 en: ', port)
})

app.get('/api/productos/listar', (req, res) => {
    const nuevoProd = new Archivo('productos.js');
    const productos = nuevoProd.read();

    if (productos.length === 0) {
        res.status(400).json({error: 'no hay productos cargados'});
    }
    else {
        res.status(200).json(productos);
    }
});

app.get('/api/productos/listar/:id', async (req, res) => {
    const nuevoProd = new Archivo('productos.js')
    const productos = await nuevoProd.read();
    const producto = await productos.filter(p => p.id == req.params.id);

    if (producto.length == 0) {
        res.status(404).json({error: "producto no encontrado"});
    }
        
    else {
        res.status(200).json(producto);
    }
});

app.post('/api/productos/guardar', async (req, res) => {
    try {
        const nuevoProd = new Archivo('productos.js')

        if(!req.body.titulo) {
            res.status(400).json({error: 'el producto debe tener titulo'});
        }
            
        if(!req.body.precio){
            res.status(400).json({error: 'el producto debe tener precio'});
        }
            
        if(!req.body.linkFoto) {
            res.status(400).json({error: 'el producto debe tener link de la foto'});
        }
            
        const aggProducto = new Producto(null, req.body.name, req.body.price, req.body.thumbnail);
        const prodCreado = await nuevoProd.save(aggProducto);

        if (!prodCreado){
            res.status(400).json({error: 'El producto ya existe'});
        }
            
        else {
            res.status(200).json({message: "Crea2"});
        }
    } catch (err) {
        res.status(400).json({error: "algo salio mal en el POST"});
    }
})