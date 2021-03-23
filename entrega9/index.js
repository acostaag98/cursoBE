const express = require('express');
const Producto = require('./producto');
const Archivo = require('./Archivo.js')
const port = process.env.PORT || 5000;

const app = express();

const server = app.listen(port, () => {
    console.log('corrien2 en: ', port)
})

app.get('/api/productos/listar', (req, res) => {
    const nuevoProd = new Producto('productos.js');
    const productos = nuevoProd.read();

    if (productos.length === 0) {
        res.status(400).json({error: 'No hay productos'});
    }
    else {
        res.status(200).json(productos);
    }
});
