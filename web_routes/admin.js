const express = require("express");
const router = express.Router();

const web_adminController = require("../web_controller/admin_controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/product_image");

router.post("/admin/login", web_adminController.admin_login);
router.put("/admin/edit_profile", upload.single("image"), web_adminController.admin_editProfile);

// Dashboard routes
router.get("/admin/dashboard_data", web_adminController.admin_dashboard);
// router.get("/admin/seller_earning", web_adminController.seller_earning)
// router.get("/admin/all_orders", web_adminController.total_orders)
// router.get("/admin/customers", web_adminController.customers_data)

// all customer
router.get("/admin/all_customers", web_adminController.all_customers);

// addProduct routes
router.post(
  "/admin/addProduct",
  upload.single("product_image"),
  web_adminController.postProduct
);

// all product routes
router.get("/admin/fetch_byId/", web_adminController.getAllProductById);
router.get("/admin/all_product", web_adminController.all_product);
router.delete("/admin/delete_product", web_adminController.delete_all_product);
router.put("/admin/update_product", web_adminController.update_all_product);
// router.post("/all_product", web_adminController.postProduct)

// category
router.get("/category/:id", web_adminController.fetchProductById);
router.get("/admin/all_category", web_adminController.product_category);
router.post("/admin/post_category", web_adminController.post_product_category);
router.delete(
  "/admin/delete_category",
  web_adminController.delete_product_category
);
router.put(
  "/admin/update_category",
  web_adminController.update_product_category
);

// admin Orders
router.get("/admin/orders", web_adminController.getAllAdminOrders);
router.delete("/admin/delete_order", web_adminController.deleteAdminOrder);
router.put(
  "/admin/update_order",
  web_adminController.update_admin_order_payment
);
router.post("/password_change", web_adminController.changepassword);

module.exports = router;
