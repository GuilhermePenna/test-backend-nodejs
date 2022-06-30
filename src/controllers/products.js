const { isEmpty } = require("lodash");
const Product = require("../service/products");

function createNewProduct(req, res, next) {
  Product.createNewProduct(req.body)
    .then((newProduct) => {
      if (newProduct) {
        res.status(200).json(newProduct);
      } else {
        res
          .status(400)
          .json("Erro ao criar novo produto, verifique seus parametros !");
      }
    })
    .catch((err) => {
      console.log("ERRO: ", err);
      next(err);
    });
}

function getProducts(req, res, next) {
  console.log("ENTROU NA CONTROLLER");
  Product.getProducts(req.query)
    .then((products) => {
      console.log("PASSOU DO THEN");
      if (products?.length) {
        res.status(200).json(products);
      } else {
        res.status(404).json("Nenhum produto foi encontrado !");
      }
    })
    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function getProductByNameOrCategory(req, res, next) {
  try {
    Product.getProductByNameOrCategory(req.query).then((products) => {
      if (products?.length) {
        res.status(200).json(products);
      } else {
        res.status(404).json("Nenhum Produto foi encontrado !");
      }
    });
  } catch (err) {
    if (err.status) res.status(err.status).json(err.message);
    else next(err);
  }
}

function editProduct(req, res, next) {
  Product.editProduct(req.body)
    .then((product) => {
      if (product && !isEmpty(product)) {
        res.status(200).json(product);
      } else {
        res.status(404).json("Produto não encontrado !");
      }
    })
    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function deleteProduct(req, res, next) {
  try {
    Product.deleteProduct(req.query).then((product) => {
      if (product && !isEmpty(product)) {
        res.status(200).json("Produto Deletado com sucesso !");
      } else {
        res.status(404).json("Produto não encontrado !");
      }
    });
  } catch (err) {
    if (err.status) res.status(err.status).json(err.message);
    else next(err);
  }
}

module.exports = {
  getProductByNameOrCategory,
  getProducts,
  createNewProduct,
  editProduct,
  deleteProduct,
};
