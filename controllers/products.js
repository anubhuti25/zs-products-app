const Product = require('../models/products');

exports.createProduct = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
    price: req.body.price,
  });
  product.save()
    .then((createdProduct) => {
      res.status(201).json({
        message: 'Product added successfully',
        product:{
          id: createdProduct._id,
          title: createdProduct.title,
          description: createdProduct.description,
          price: createdProduct.price,
          imagePath: createdProduct.imagePath
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Creating a product failed!'
      })
    });
};

exports.updateProduct = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const product = new Product({
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imagePath: imagePath
  });
  Product.updateOne({_id: req.params.id, creator: req.userData.userId}, product)
    .then(result => {
      if(result.n > 0) {
        res.status(200).json('Update successful!');
      } else {
        res.status(401).json('Not authorized!');
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Couldn\'t update product!'
      })
    });
};

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let productsData;

  if(pageSize && currentPage){
    productQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  productQuery
    .then(documents =>{
      productsData = documents;
      return Product.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        count: count,
        products: productsData
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching products failed!'
      })
    });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if(product){
        res.status(200).json(product);
      }
      else{
        res.status(404).json({message: 'Product not found'});
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching product failed!'
      })
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then((result) => {
    if(result.n > 0){
      return res.status(200).json({message: 'Product deleted!'});
    }
    res.status(401).json({message: 'Not authorized!'});
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Deleting a product failed!'
    })
  });
}
