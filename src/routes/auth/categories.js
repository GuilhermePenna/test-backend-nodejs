const {
  createNewCategory,
  getCategoryByName,
  getCategories,
  deleteCategory,
  editCategory,
} = require("../../controllers/categories");
var router = express.Router();
const validate = require("express-validation");
const categoryValidation = require("../../validations/categories");

router.post("/", validate(categoryValidation["/"]), createNewCategory);

router.get("/search", getCategoryByName);

router.get("/", getCategories);

router.delete("/", deleteCategory);

router.put("/", editCategory);

module.exports = router;
