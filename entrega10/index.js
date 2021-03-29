const express = require('express');
const router = express.Router();
const port = process.env.PORT || 3000;

const Archivo = require('./Archivo.js');
const Producto = require('./Producto.js');

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/productos');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
} //* para q no me salte lo de CORS

const app = express();
app.use(allowCrossDomain)
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/api', router);

const server = app.listen(port, () => {
    console.log('Sv escuchando en: ' + port);
})

server.on('error', err => {
    console.log(err)
});

app.get('/productos', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

router.get('/productos/listar', async (req, res) => {
    const arcProductos = new Archivo('items.js')
    const productos = await arcProductos.read();

    if (productos.length == 0){
        res.status(404).json({error: 'Productos no encontrados'});
    }
    else {
        res.status(200).json(productos);
    }
});

router.get('/productos/listar/:id', async (req, res) => {
    const arcProductos = new Archivo('items.js')
    const productos = await arcProductos.read();
    const producto = await productos.filter(p => p.id == req.params.id);

    if (producto.length == 0){
        res.status(404).json({error: "Producto no encontrado"});
    }
    else {
        res.status(200).json(producto);
        }
});

router.post('/productos/guardar', async (req, res) => {
    try {
        const arcProductos = new Archivo('items.js')
        if(!req.body.name) {
          res.status(400).json({error: 'El producto debe tener nombre'});
          return;
        }

        if(!req.body.price) {
          res.status(400).json({error: 'El producto debe tener precio'});
          return;
        }

        if(!req.body.thumbnail) {
          res.status(400).json({error: 'El producto tiene que tener link de foto'});
          return;
        }

        const nuevoProducto = new Producto(null, req.body.name, req.body.price, req.body.thumbnail);
        const creado = await arcProductos.save(nuevoProducto);

        if (!creado) {
          res.status(400).json({error: 'El producto ya existe'});
          return;
        }
            
        else
            res.status(200).json({message: "creado"});
    } catch (e) {
        res.status(400).json({error: "Algo salio mal en el guardar"});
    }
});

router.put('/productos/actualizar/:id', async (req, res) => {
  try {
      const arcProductos = new Archivo('items.js')

      if(!req.body.name) {
        res.status(400).json({error: 'El producto debe tener nombre'});
        return;
      }

      if(!req.body.price) {
        res.status(400).json({error: 'El producto debe tener precio'});
        return;
      }

      if(!req.body.thumbnail) {
        res.status(400).json({error: 'El producto debe tener link de foto'});
        return;
      }

      const productoId = Number(req.params.id);
      const producto = new Producto(productoId, req.body.name, req.body.price, req.body.thumbnail);
      const status = await arcProductos.update(producto);

      if (!status) {
        res.status(400).json({error: 'El producto no existe'});
        return;
      }
          
      else
          res.status(200).json({message: 'Actualizado', product: status});
  } catch (e) {
    console.log(e)
      res.status(400).json({error: "Algo salio mal en el put"});
  }
});

router.delete('/productos/borrar/:id', async (req, res) => {
  try {
      const arcProductos = new Archivo('items.js')
      const productoId = Number(req.params.id);
      const status = await arcProductos.delete(productoId);

      if (!status) {
        res.status(400).json({error: 'El producto no existe'});
        return;
      }
          
      else
          res.status(200).json({message: 'borrado', producto: status});
  } catch (err) {
    console.log(err)
      res.status(400).json({error: "Aglo salio mal en el delete"});
  }
});

module.exports = app;