const Category = require("../collections/categories");
const { isEmpty, pick, reject } = require("lodash");
const Error = require("../utils/error-class");

function getCategoryByName(name) {
  return Category.findOne({ name });
}

function getCategoryByNameAndUpdate(name, product) {
  return Category.findOneAndUpdate({ name }, { $push: { products: product } });
}

function getCategoryAndRemove(id, product) {
  return Category.findOneAndUpdate(
    { _id: id },
    { $pull: { products: product } }
  );
}

function createNewCategory(data) {
  if (!data || isEmpty(data)) {
    throw new Error(
      "Nenhum parametro foi passado para a criação de uma nova categoria !",
      400
    );
  }

  const newCategoryData = pick(data, [
    "name",
    "drinkType",
    "foodType",
    "isVegan",
  ]);

  const newCategory = new Category(newCategoryData);
  return newCategory.save();
}

function getCategories(data) {
  let { page, limit } = data;
  if (page <= 0) {
    page = 1;
  }
  limit = parseInt(limit) || 10;
  const skip = (parseInt(page) - 1) * limit || 0;

  return Category.find().skip(skip).limit(limit);
}

function editCategory(id, data) {
  if (!data || isEmpty(data)) {
    throw new Error(
      "Nenhum parametro foi passado para a edição da categoria !",
      400
    );
  }
  return new Promise((resolve, reject) => {
    Category.findOne({ _id: id })
      .then((category) => {
        const updatecategoryData = pick(data, [
          "name",
          "drinkType",
          "isVegan",
          "foodType",
        ]);

        for (const key in updatecategoryData) {
          if (category[key]) {
            category[key] = updatecategoryData[key];
          }
        }

        category
          .save()
          .then((category) => {
            resolve(category);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(new Error("Categoria não encontrada !", 404));
      });
  });
}

function deleteCategory(name) {
  return new Promise((resolve, reject) => {
    Category.findOne({ name })

      .then((category) => {
        if (!category || isEmpty(category)) {
          throw new Error("categoria não encontrada", 404);
        }

        if (category?.products?.length) {
          throw new Error(
            "Não é possível excluir uma categoria que tenha produtos associados !",
            400
          );
        }
        category.delete().then((category) => {
          resolve(category);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getCategoryByName,
  createNewCategory,
  getCategories,
  getCategoryByNameAndUpdate,
  getCategoryAndRemove,
  deleteCategory,
  editCategory,
};
