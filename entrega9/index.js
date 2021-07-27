const express = require('express');
const router = express.Router();
const port = process.env.PORT || 8080;

const DALProductos = require('./db/DALProductos');
const Producto = require('./entities/Producto');

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080/productos');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const app = express();
app.use(allowCrossDomain)
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/api', router);

const server = app.listen(port, () => {
    console.log('Server listening at port: ' + port);
})

server.on('error', err => {
    console.log(err)
});

app.get('/productos', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

router.get('/productos/listar', async (req, res) => {
    const dalProductos = new DALProductos('items.js')
    const products = await dalProductos.read();

    if (products.length == 0)
        res.status(404).json({error: 'Products not found'});
    else 
        res.status(200).json(products);
});

router.get('/productos/listar/:id', async (req, res) => {
    const dalProductos = new DALProductos('items.js')
    const products = await dalProductos.read();
    const product = await products.filter(p => p.id == req.params.id);

    if (product.length == 0)
        res.status(404).json({error: "Product not found"});
    else 
        res.status(200).json(product);
});

router.post('/productos/guardar', async (req, res) => {
    try {
        const dalProductos = new DALProductos('items.js')
        console.log(req.body)
        if(!req.body.name) {
          res.status(400).json({error: 'Product must have a title.'});
          return;
        }

        if(!req.body.price) {
          res.status(400).json({error: 'Product must have a price.'});
          return;
        }

        if(!req.body.thumbnail) {
          res.status(400).json({error: 'Product must have a thumbnail.'});
          return;
        }

        const newProduct = new Producto(null, req.body.name, req.body.price, req.body.thumbnail);
        const created = await dalProductos.save(newProduct);

        if (!created) {
          res.status(400).json({error: 'The product already exists'});
          return;
        }
            
        else
            res.status(200).json({message: "Created!"});
    } catch (e) {
        res.status(400).json({error: "Whoops! Something went wrong..."});
    }
});

router.put('/productos/actualizar/:id', async (req, res) => {
  try {
      const dalProductos = new DALProductos('items.js')

      if(!req.body.name) {
        res.status(400).json({error: 'Product must have a title.'});
        return;
      }

      if(!req.body.price) {
        res.status(400).json({error: 'Product must have a price.'});
        return;
      }

      if(!req.body.thumbnail) {
        res.status(400).json({error: 'Product must have a thumbnail.'});
        return;
      }

      const productId = Number(req.params.id);
      const product = new Producto(productId, req.body.name, req.body.price, req.body.thumbnail);
      const status = await dalProductos.update(product);

      if (!status) {
        res.status(400).json({error: 'The product does not exist'});
        return;
      }
          
      else
          res.status(200).json({message: 'updated', product: status});
  } catch (e) {
    console.log(e)
      res.status(400).json({error: "Whoops! Something went wrong..."});
  }
});

router.delete('/productos/borrar/:id', async (req, res) => {
  try {
      const dalProductos = new DALProductos('items.js')
      const productId = Number(req.params.id);
      const status = await dalProductos.delete(productId);

      if (!status) {
        res.status(400).json({error: 'The product does not exist'});
        return;
      }
          
      else
          res.status(200).json({message: 'deleted', product: status});
  } catch (e) {
    console.log(e)
      res.status(400).json({error: "Whoops! Something went wrong..."});
  }
});

module.exports = app;