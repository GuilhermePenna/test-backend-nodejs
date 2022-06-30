const Product = require("../collections/products");
const { isEmpty, pick, reject } = require("lodash");
const {
  getCategoryByNameAndUpdate,
  getCategoryByName,
  getCategoryAndRemove,
} = require("./categories");
const searchTitleOrId = require("../utils/search-title-or-id");
const Error = require("../utils/error-class");

function getProducts(data) {
  console.log("ENTROUUU");
  let { page, limit } = data;
  if (page <= 0) {
    page = 1;
  }
  limit = parseInt(limit) || 10;
  const skip = parseInt(page - 1) * limit || 0;
  //const productReturn = Product.find().exec();
  //console.log("TYPE: ", typeof productReturn);
  Product.find().then(console.log).catch(console.log);
  //console.log(Product.find().exec());
  return Product.find();
  //.populate("category").skip(skip).limit(limit).exec();
}

function getProductByNameOrCategory(data) {
  let { page, limit, category, name } = data;

  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;

  if (page <= 0) {
    page = 1;
  }

  const skip = (page - 1) * limit || 0;

  return Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: {
        $or: [
          { title: { $regex: String(name) } },
          { "category.name": category },
        ],
      },
    },
    {
      $project: {
        category: { $first: "$category" },
        name: 1,
        title: 1,
        description: 1,
        price: 1,
      },
    },
  ])
    .skip(skip)
    .limit(limit);
}

function createNewProduct(data) {
  if (!data || isEmpty(data)) {
    throw new Error(
      "Nenhum parametro foi passado para a criação de um novo produto !",
      400
    );
  }

  const newProductData = pick(data, [
    "title",
    "description",
    "price",
    "category",
  ]);

  return new Promise((resolve, reject) => {
    getCategoryByName(newProductData.category)
      .then((category) => {
        if (!category || isEmpty(category)) {
          reject(new Error("Categoria não encontrada", 404));
        }

        newProductData.category = category._id;

        const newProduct = new Product(newProductData);

        newProduct
          .save()
          .then((newProduct) => {
            getCategoryByNameAndUpdate(category.name, newProduct._id).then(
              () => {
                resolve(newProduct);
              }
            );
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

function getProductByTitle(title) {
  return Product.findOne({ title });
}

function editProduct(data) {
  return new Promise((resolve, reject) => {
    try {
      if (!data || isEmpty(data)) {
        throw new Error(
          "Nenhum parâmetro foi passado para a edição do produto !",
          400
        );
      }

      const { name } = data;

      getProductByTitle(name)
        .then((product) => {
          if (!product) {
            throw new Error("Nenhum Produto foi encontrado !", 400);
          }

          const newProductData = pick(data, [
            "title",
            "price",
            "description",
            "category",
          ]);

          if (newProductData.category) {
            getCategoryByName(newProductData.category)
              .then((category) => {
                if (!category || isEmpty(category)) {
                  throw new Error("Categoria não encontrada !", 404);
                }

                if (product.category != category._id) {
                  getCategoryAndRemove(product.category, product._id)
                    .then(() => {
                      getCategoryByNameAndUpdate(
                        newProductData.category,
                        product._id
                      )
                        .then(() => {
                          newProductData.category = category._id;

                          for (const key in newProductData) {
                            product[key] = newProductData[key];
                          }

                          resolve(product.save());
                        })

                        .catch((err) => reject(err));
                    })

                    .catch((err) => reject(err));
                }
              })

              .catch((err) => reject(err));
          } else {
            for (const key in newProductData) {
              product[key] = newProductData[key];
            }

            resolve(product.save());
          }
        })

        .catch((e) => reject(e));
    } catch (err) {
      throw err;
    }
  });
}

async function deleteProduct(data) {
  if (!data || isEmpty(data)) {
    throw new Error("Nenhum parâmetro foi passado !", 400);
  }
  return new Promise((resolve, reject) => {
    Product.findOneAndDelete(searchTitleOrId({}, data.id))
      .then((product) => {
        if (product) {
          getCategoryAndRemove(product.category, product._id).then(() => {
            resolve(product);
          });
        }
        return;
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  createNewProduct,
  getProductByNameOrCategory,
  getProducts,
  editProduct,
  deleteProduct,
};
