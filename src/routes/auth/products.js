const {
  getProductByNameOrCategory,
  getProducts,
  createNewProduct,
  editProduct,
  deleteProduct,
} = require("../../controllers/products");

var router = express.Router();

const validate = require("express-validation");

const productValidation = require("../../validations/products");

router.post("/", validate(productValidation["/"]), createNewProduct);

router.get("/search", getProductByNameOrCategory);

router.get("/", getProducts);

router.put("/", validate(productValidation["/"]), editProduct);

router.delete("/", deleteProduct);

module.exports = router;
