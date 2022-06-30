const Category = require("../service/categories");

function getCategories(req, res, next) {
  Category.getCategories(req.query)

    .then((categories) => {
      if (categories?.length) {
        res.status(200).json(categories);
      } else {
        res.status(404).json("Nenhuma categoria foi encontrada !");
      }
    })

    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function getCategoryByName(req, res, next) {
  Category.getCategoryByName(req.query.name)

    .then((category) => {
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json("Categoria não encontrada !");
      }
    })

    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function createNewCategory(req, res, next) {
  Category.createNewCategory(req.body)

    .then((newCategory) => {
      if (newCategory) {
        res.status(200).json(newCategory);
      } else {
        res
          .status(400)
          .json("Erro ao criar nova categoria,verifique seus parâmetros !");
      }
    })

    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function deleteCategory(req, res, next) {
  Category.deleteCategory(req.query.name)

    .then((category) => {
      if (category) {
        res.status(200).json("Categoria deletada com sucesso !");
      } else {
        res.status(500).json("Não foi possível excluir a categoria");
      }
    })

    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

function editCategory(req, res, next) {
  Category.editCategory(req.query.id, req.body)

    .then((category) => {
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(500);
      }
    })

    .catch((err) => {
      if (err.status) res.status(err.status).json(err.message);
      else next(err);
    });
}

module.exports = {
  createNewCategory,
  getCategoryByName,
  getCategories,
  deleteCategory,
  editCategory,
};
