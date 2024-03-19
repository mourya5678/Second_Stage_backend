const { raw } = require("mysql");
const db = require("../utils/database");
const config = require("../config");

const baseurl = config.base_url;

module.exports = {
  createProductDetails: async (productDetails) => {
    console.log(productDetails);
    return db.query("INSERT INTO Products_Details SET ?", [productDetails]);
  },

  createProduct: async (product) => {
    console.log(product);
    return db.query("INSERT INTO Product SET ?", [product]);
  },

  getBrandData: async () => {
    return db.query("Select * from brand");
  },

  getProductCountOfBrand: async (data) => {
    return db.query(`select * from product where product_brand = '${data}'`);
  },

  fetchProductById: async (id) => {
    return db.query(" select * from product where id= ?", [id]);
  },

  fetchProductDetailsById: async (id) => {
    return db.query(" select * from Products_Details where id= ?", [id]);
  },

  addProductBrand: async (data) => {
    return db.query("INSERT INTO brand SET ?", [data])
  },

  getProductBrandFilter: async (data) => {
    return db.query("select * from brand  where product_brand = ?", [data])
  },

  getProductbrandData: async () => {
    return db.query("select product_brand from brand")
  },

  addProductCategoryData: async (data) => {
    return db.query("INSERT INTO categories SET ?", [data]);
  },

  getProductCategoryFilter: async (data) => {
    return db.query('select * from categories where product_category =?', [data]);
  },

  getProductCategory: async () => {
    return db.query('select product_category from categories')
  },

  addproductColourData: async (data) => {
    return db.query("INSERT INTO colour_product SET ?", [data]);
  },

  getProductColourFilter: async (data) => {
    return db.query('select * from colour_product where product_color = ?', [data])
  },

  getColourProduct: async () => {
    return db.query('select product_color from colour_product')
  },

  updateProductById: async (data, id) => {
    const query = "UPDATE Product SET productName=?, categoryId=? WHERE id=?";
    const result = await db.query(query, [
      data.productName,
      data.categoryId,
      id,
    ]);
    return result;
  },

  update_product_value: async (data, product_id) => {
    return db.query(`UPDATE product set ? where id =${product_id} `, [data, product_id])
  },

  updateProduct_image_ById: async (data, id) => {
    const query = "UPDATE product SET product_image=? WHERE id=?";
    const result = await db.query(query, [
      data,
      id,
    ]);
    return result;
  },
  updateProductDetailsById: async (data, id) => {
    try {
      const query = `
        UPDATE Products_Details 
        SET 
          productName=?, 
          description=?, 
          price=?, 
          color=?, 
          size=?, 
          stockQuantity=?, 
          productImage=?, 
          sku=?, 
          brand=?, 
          productId=?, 
          discount=?, 
          blingType=?, 
          blingLevel=?, 
          \`condition\`=?,  -- Use backticks to escape the reserved keyword
          padding=? 
        WHERE id=?
      `;
      const result = await db.query(query, [
        data.productName,
        data.description,
        data.price,
        data.color,
        data.size,
        data.stockQuantity,
        data.productImage,
        data.sku,
        data.brand,
        data.productId,
        data.discount,
        data.blingType,
        data.blingLevel,
        data.condition,
        data.padding,
        id,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteProductById: async (id) => {
    return db.query(`delete  from Product where id='${id}' `);
  },
  getAllProductById: async (productId) => {
    try {
      const sql = `
            SELECT 
                Product.productName AS categoryProduct,
                Categories.categoryName,
                Categories.categoryImage,
                Products_Details.productName,
                Products_Details.productType,
                Products_Details.location,
                Products_Details.description,
                Products_Details.price,
                Products_Details.color, 
                Products_Details.size,
                Products_Details.stockQuantity,
                Products_Details.discount,
                Products_Details.productImage,
                Products_Details.sku,
                Products_Details.brand,
                Products_Details.blingLevel,
                Products_Details.condition,
                Products_Details.padding,
                Products_Details.blingType,
                Size.sizeTop,
                Size.sizeBottom,
                Style.top AS styleTop,
                Style.bottom AS styleBottom,
                Style.angelsThemeWear,
                Style.shoes
            FROM Products_Details
            JOIN Product ON Products_Details.productId = Product.id
            JOIN Categories ON Product.categoryId = Categories.id
            JOIN Size ON Products_Details.sizeId = Size.id
            JOIN Style ON Products_Details.styleId = Style.id
            WHERE Product.id = ?;  -- Add this WHERE clause to filter by product ID
        `;
      return (result = await db.query(sql, [productId]));
    } catch (error) {
      console.error("Error in getAllProductById:", error);
      throw error; // Rethrow the error for the calling function to handle
    }
  },

  //***********Kaif start here******************

  fetchBuyerBy_Id: async (id) => {
    return db.query(`select * from tbl_buyer where id= '${id}'`, [id]);
  },

  getAllProducttt: async () => {
    return db.query("select * from product  ");
  },

  // getAllProduct: async () => {
  //   try {
  //     const sql = `
  //     SELECT

  //     product.id,
  //     product.location,
  //     product.price_sale_lend_price,
  //     product.product_replacement_price,
  //     product.product_rental_period,
  //     product.product_description,
  //     CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_colors.product_color), '') AS product_color,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_brands.product_brand), '') AS product_brand,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_top), '') AS style_top,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_styles.style_bottom), '') AS style_bottom,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_size.size_top), '') AS size_top,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_size.size_bottom), '') AS size_bottom,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_type), '') AS billing_type,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_level), '') AS billing_level,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_billing.billing_condition), '') AS billing_condition,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_category.product_category), '') AS product_category,
  //     COALESCE(GROUP_CONCAT(DISTINCT product_padding.product_padding), '') AS product_padding
  //    FROM product

  //    LEFT JOIN cart on product.id = cart.product_id
  //     LEFT JOIN product_images ON product.id = product_images.product_id
  //     LEFT JOIN product_colors ON product.id = product_colors.product_id
  //     LEFT JOIN product_brands ON product.id = product_brands.product_id
  //     LEFT JOIN product_styles ON product.id = product_styles.product_id
  //     LEFT JOIN product_size ON product.id = product_size.product_id
  //     LEFT JOIN product_billing ON product.id = product_billing.product_id
  //     LEFT JOIN product_category ON product.id = product_category.product_id
  //     LEFT JOIN product_padding ON product.id = product_padding.product_id

  //   `;

  //     return (result = await db.query(sql));
  //   } catch (error) {
  //     console.error("Error in getAllProduct:", error);
  //     throw error; // Rethrow the error for the calling function to handle
  //   }
  // },

  // getAllProduct: async () => {
  //   try {
  //     const sql = `
  //     SELECT
  //       product.id,
  //       product.location,
  //       product.product_buy_rent,
  //       product.price_sale_lend_price,
  //       product.product_replacement_price,
  //       product.product_rental_period,
  //       product.product_description,
  //       product.wishlist_like,
  //       CONCAT('${baseurl}/productImage/', product_images.product_image) AS product_image,
  //       CONCAT(product_colors.product_color) AS product_colors,
  //       CONCAT(product_brands.product_brand) AS product_brands,
  //       CONCAT(product_styles.style_top) AS style_top,
  //       CONCAT(product_styles.style_bottom) AS style_bottom,
  //       CONCAT(product_size.size_top) AS size_top,
  //       CONCAT(product_size.size_bottom) AS size_bottom,
  //       CONCAT(product_billing.billing_type) AS billing_type,
  //       CONCAT(product_billing.billing_level) AS billing_level,
  //       CONCAT(product_billing.billing_condition) AS billing_condition,
  //       CONCAT(product_category.product_category) AS product_category,
  //       CONCAT(product_padding.product_padding) AS product_padding
  //     FROM product
  //     LEFT JOIN product_images ON product.id = product_images.product_id
  //     LEFT JOIN product_colors ON product.id = product_colors.product_id
  //     LEFT JOIN product_brands ON product.id = product_brands.product_id
  //     LEFT JOIN product_styles ON product.id = product_styles.product_id
  //     LEFT JOIN product_size ON product.id = product_size.product_id
  //     LEFT JOIN product_billing ON product.id = product_billing.product_id
  //     LEFT JOIN product_category ON product.id = product_category.product_id
  //     LEFT JOIN product_padding ON product.id = product_padding.product_id;
  //   `;

  //     return (result = await db.query(sql));
  //   } catch (error) {
  //     console.error("Error in getAllProduct:", error);
  //     throw error; // Rethrow the error for the calling function to handle
  //   }
  // },

  getAllProduct: async () => {
    return db.query(
      `select * from product `
    );
  },

  get_my_Product: async (user_id) => {
    return db.query(
      `select * from product  where seller_id = '${user_id}'`
    );
  },

  getAllProduct_by_id: async (prodcutId) => {
    return db.query(
      `select * from product  where id = '${prodcutId}'`
    );
  },
  checkWishlistBy_id: async (productId, userId) => {
    return db.query(
      `select * from product_wishlist where product_id='${productId}' and buyer_id='${userId}'`
    );
  },

  checkWishlistBy_productId: async (productId) => {
    return db.query(
      `select * from product_wishlist where product_id='${productId}' `
    );
  },

  get__products: async () => {
    return db.query("SELECT * FROM product ORDER BY id DESC LIMIT 1; ");
  },

  getAllProduct_images: async () => {
    return db.query("select * from product_images ");
  },

  getAllProduct_colors: async () => {
    return db.query("select * from product_colors ");
  },

  insert__into_product: async (data) => {
    return db.query("INSERT INTO product SET ?", [data]);
  },

  insert_product_images: async (data) => {
    return db.query(`insert into product_images set ?`, [data]);
  },

  // update_product_images: async (data) => {
  // }

  insert_product_images_bulk: async (product_id, data) => {
    return db.query(
      `INSERT INTO product_images (product_id, product_image) VALUES (?, ?)`,
      [product_id, data]
    );
  },

  get_product_imagesss: async (product_id) => {
    return db.query(
      `SELECT   CONCAT('${baseurl}/productImage/', product_images.product_image) as product_image  FROM product_images  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_image_url: async (data) => {
    return db.query(`select * from product_images where product_id = ${data}`);
  },

  get_product_image_by_id: async (id) => {
    return db.query(`select * from product_images where id=${id}`);
  },

  delete_rpoduct_image_by_id: async (id) => {
    return db.query(`delete from product_images where id=${id}`);
  },

  get_product_by_id: async (product_id) => {
    return db.query(`SELECT * FROM product WHERE id = ?`, [product_id]);
  },

  update_product: async (product_id, updatedData) => {
    return db.query(`UPDATE product SET ? WHERE id = ?`, [
      updatedData,
      product_id,
    ]);
  },

  update_product_colour: async (colour, product_id) => {
    return db.query(`UPDATE product_colors SET product_color= '${colour}' WHERE product_id=${product_id}`)
  },

  update_product_size: async (size_top, size_bottom, product_id) => {
    return db.query(`UPDATE product_size SET size_top = '${size_top}', size_bottom='${size_bottom}' WHERE product_id=${product_id}`)
  },

  update_product_style: async (style_top, style_bottom, product_id) => {
    return db.query(`UPDATE product_styles SET style_top = '${style_top}', style_bottom='${style_bottom}' WHERE product_id=${product_id}`)
  },

  update_billing_data: async (billing_type, billing_level, billing_condition, product_id) => {
    return db.query(`UPDATE product_billing SET billing_type = '${billing_type}', billing_level='${billing_level}', billing_condition='${billing_condition}' WHERE product_id=${product_id}`)
  },

  update_paddingData: async (product_padding, product_id) => {
    return db.query(`UPDATE product_padding SET product_padding = '${product_padding}' WHERE product_id=${product_id}`)
  },

  delete_product_images: async (product_id) => {
    return db.query(`DELETE FROM product_images WHERE product_id = ?`, [
      product_id,
    ]);
  },

  get_Product_Details: async () => {
    return db.query("select * from product  ");
  },

  get_product_by_id: async (product_id) => {
    return db.query(`select * from product where id=?`, [product_id]);
  },

  get_product_by_category: async (product_category) => {
    return db.query(`select * from product where product_category=?`, [
      product_category,
    ]);
  },

  insert_product_color: async (data) => {
    return db.query(`insert into product_colors set ?`, [data]);
  },

  get_product_color: async (product_id) => {
    return db.query(
      `SELECT product_color FROM product_colors  where product_id = ${product_id}`,
      [product_id]
    );
  },

  // Example of delete_product_colors
  delete_product_colors: async (product_id) => {
    return db.query(`DELETE FROM product_colors WHERE product_id = ?`, [
      product_id,
    ]);
  },

  getAllProduct_by_categoryyyy: async (product_category) => {
    try {
      const params = [product_category];
      let sql = `
        SELECT
         product.id,
          product.product_brand,
          product.product_category,
          product.size_top,
          product.size_bottom,
          product.style_top,
          product.style_bottom,
          product.billing_type,
          product.billing_level,
          product.billing_condition,
          product.product_padding,
          product.location,
          product.price_sale_lend_price,
          product.product_replacement_price,
          product.product_rental_period,
          product.product_description,
          CONCAT('${baseurl}/productImage/', product_images.product_image) as product_image,
          product_colors.product_color
         
        FROM product
          LEFT JOIN product_images ON product.id = product_images.product_id
          LEFT JOIN product_colors ON product.id = product_colors.product_id
          
        WHERE product.product_category = ?
      `;

      // Execute the query
      const result = await db.query(sql, params);

      return result;
    } catch (error) {
      console.error("Error in getAllProduct_filter:", error);
      throw error;
    }
  },

  checkNUllUnd: (data) => {
    return data === undefined || data === null ? 0 : data;
  },

  insert_product_brand: async (data) => {
    return db.query(`insert into product_brands set ?`, [data]);
  },

  getAllProduct_brands: async () => {
    return db.query("select * from product_brands ");
  },

  // All categories code here

  fetchProductCategories: async () => {
    return db.query("select product_category from product_category");
  },

  fetchProductBrand: async () => {
    return db.query("select product_brand from product_brands");
  },

  fetchProductBuyRent: async () => {
    return db.query("select product_buy_rent from product");
  },

  fetchProductSizeStandard: async () => {
    return db.query("select size_standard from product");
  },

  fetchProductLocation: async () => {
    return db.query("select location from product");
  },

  fetchProductColor: async () => {
    return db.query("select product_color from product_colors");
  },

  fetchProductRentalPeriod: async () => {
    return db.query("select product_rental_period from product");
  },

  fetchProductStyleTop: async () => {
    return db.query("select style_top from product_styles");
  },

  fetchProductStyleBottom: async () => {
    return db.query("select style_bottom from product_styles");
  },

  fetchProductSizeTop: async () => {
    return db.query("select size_top from product_size");
  },
  fetchProductSizeBottom: async () => {
    return db.query("select size_bottom from product_size");
  },
  fetchProductBillingType: async () => {
    return db.query("select billing_type from product_billing");
  },
  fetchProductBillingLevel: async () => {
    return db.query("select billing_level from product_billing");
  },
  fetchProductBillingCondition: async () => {
    return db.query("select billing_condition from product_billing");
  },
  fetchProductPadding: async () => {
    return db.query("select product_padding from product_padding");
  },

  // 01 feb code starts new

  insert_product_brand: async (data) => {
    return db.query(`insert into product_brands set ?`, [data]);
  },

  insert_product_billing: async (data) => {
    return db.query(`insert into product_billing set ?`, [data]);
  },

  insert_product_category: async (data) => {
    return db.query(`insert into product_category set ?`, [data]);
  },

  insert_product_size: async (data) => {
    return db.query(`insert into product_size set ?`, [data]);
  },

  insert_product_style: async (data) => {
    return db.query(`insert into product_styles set ?`, [data]);
  },

  insert_product_padding: async (data) => {
    return db.query(`insert into product_padding set ?`, [data]);
  },

  get_product_brandd: async (product_id) => {
    return db.query(
      `SELECT product_brand FROM product_brands  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_style: async (product_id) => {
    return db.query(
      `SELECT * FROM product_styles  where product_id = ${product_id}`,
      [product_id]
    );
  },

  product_billing_details: async (product_id) => {
    return db.query(`SELECT * FROM product_billing where product_id = ${product_id}`)
  },

  product_padding_details: async (product_id) => {
    return db.query(`SELECT * FROM product_padding where product_id = ${product_id}`)
  },


  // SELECT * FROM `product_padding`


  get_product_size: async (product_id) => {
    return db.query(
      `SELECT size_top, size_bottom FROM product_size  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_billing: async (product_id) => {
    return db.query(
      `SELECT * FROM product_billing  where product_id = ${product_id}`,
      [product_id]
    );
  },

  get_product_category: async (product_id) => {
    return db.query(
      `SELECT product_category FROM product_category  where product_id = ${product_id}`,
      [product_id]
    );
  },
  get_product_padding: async (product_id) => {
    return db.query(
      `SELECT * FROM product_padding  where product_id = ${product_id}`,
      [product_id]
    );
  },

  // fetch all product

  fetch_product_brand: async () => {
    return db.query(`SELECT * FROM product_brands`);
  },
  fetch_product_style: async () => {
    return db.query(`SELECT * FROM product_styles`);
  },
  fetch_product_size: async () => {
    return db.query(`SELECT * FROM product_size`);
  },
  fetch_product_billing: async () => {
    return db.query(`SELECT * FROM product_billing`);
  },

  fetch_product_category: async () => {
    return db.query(`SELECT * FROM product_category`);
  },

  fetch_product_padding: async () => {
    return db.query(`SELECT * FROM product_padding`);
  },

  getAllProductByIdd: async (productId) => {
    try {
      const sql = `
        SELECT 
          product_category.product_category,
      product.size_standard,
      product.product_buy_rent,
      product.location,
      product.price_sale_lend_price,
      product.product_replacement_price,
      product.product_rental_period,
      product.product_description,
      product_size.size_top,
      product_size.size_bottom,
      product_styles.style_top,
      product_styles.style_bottom,
      product_brands.product_brand,
      product_billing.billing_type,
      product_billing.billing_level,
      product_billing.billing_condition,
      product_padding.product_padding,
      CONCAT('${baseurl}/productImage/', product_images.product_image) as product_image,
      product_colors.product_color
          
        FROM Product
        
        LEFT JOIN product_size ON Product.id = product_size.product_id
        LEFT JOIN product_styles ON Product.id = product_styles.product_id
        LEFT JOIN product_brands ON Product.id = product_brands.product_id
        LEFT JOIN product_billing ON Product.id = product_billing.product_id
        LEFT JOIN product_padding ON Product.id = product_padding.product_id
        LEFT JOIN product_category ON Product.id = product_category.product_id
        LEFT JOIN product_images ON product.id = product_images.product_id
          LEFT JOIN product_colors ON product.id = product_colors.product_id
        WHERE Product.id = ?;
    `;
      return (result = await db.query(sql, [productId]));
    } catch (error) {
      console.error("Error in getAllProductById:", error);
      throw error; // Rethrow the error for the calling function to handle
    }
  },


  getAllProduct_filterrrrrr: async (
    product_brand,
    product_category,
    product_color,
    size_top,
    size_bottom,
    style_top,
    style_bottom,
    billing_type,
    billing_level,
    billing_condition,
    product_padding,
    location,
    price_sale_lend_price_max,
    price_sale_lend_price_min,
    price_sale_lend_price_max_rent,
    price_sale_lend_price_min_rent,
    product_replacement_price,
    product_rental_period,
    product_description,
    product_buy_rent,
    size_standard
  ) => {
    let where = " where p.id > 0 "; // Default condition

    if (product_brand && product_brand.length > 0) {
      let newBrand = product_brand.map((brand) => `'${brand}'`).join(",");
      where += ` AND p.product_brand IN(${newBrand})`;
    }

    if (product_category && product_category.length > 0) {
      let newCategory = product_category
        .map((category) => `'${category}'`)
        .join(",");
      where += ` AND p.product_category IN(${newCategory})`;
    }

    if (product_color && product_color.length > 0) {
      let newColor = product_color.map((color) => `'${color}'`).join(",");
      where += ` AND pco.product_color IN(${newColor})`;
    }

    // console.log(">>>>>>", size_top);
    if (size_top && size_top.length !== 0) {
      let newSizeTop = size_top.map((size) => `'${size}'`).join(",");
      where += ` AND ps.size_top IN(${newSizeTop})`;
    }

    if (size_bottom && size_bottom.length > 0) {
      let newSizeBottom = size_bottom.map((size) => `'${size}'`).join(",");
      where += ` AND ps.size_bottom IN(${newSizeBottom})`;
    }

    if (style_top && style_top.length > 0) {
      let newStyleTop = style_top.map((style) => `'${style}'`).join(",");
      where += ` AND pst.style_top IN(${newStyleTop})`;
    }

    if (style_bottom && style_bottom.length > 0) {
      let newStyleBottom = style_bottom.map((style) => `'${style}'`).join(",");
      where += ` AND pst.style_bottom IN(${newStyleBottom})`;
    }

    if (billing_type && billing_type.length > 0) {
      let newBillingType = billing_type.map((type) => `'${type}'`).join(",");
      where += ` AND pbi.billing_type IN(${newBillingType})`;
    }

    if (billing_level && billing_level.length > 0) {
      let newBillingLevel = billing_level
        .map((level) => `'${level}'`)
        .join(",");
      where += ` AND pbi.billing_level IN(${newBillingLevel})`;
    }

    if (billing_condition && billing_condition.length > 0) {
      let newBillingCondition = billing_condition
        .map((condition) => `'${condition}'`)
        .join(",");
      where += ` AND pbi.billing_condition IN(${newBillingCondition})`;
    }

    if (product_padding && product_padding.length > 0) {
      let newPadding = product_padding
        .map((padding) => `'${padding}'`)
        .join(",");
      where += ` AND pp.product_padding IN(${newPadding})`;
    }

    if (location && location.length > 0) {
      let newLocation = location.map((loc) => `'${loc}'`).join(",");
      where += ` AND p.location IN(${newLocation})`;
    }

    if (
      price_sale_lend_price_max &&
      price_sale_lend_price_max.length > 0 &&
      price_sale_lend_price_min &&
      price_sale_lend_price_min.length > 0
    ) {
      where += ` AND p.price_sale_lend_price BETWEEN ${price_sale_lend_price_min} AND  ${price_sale_lend_price_max} `;
    }

    if (
      price_sale_lend_price_max_rent &&
      price_sale_lend_price_max_rent.length > 0 &&
      price_sale_lend_price_min_rent &&
      price_sale_lend_price_min_rent.length > 0
    ) {
      where += ` AND p.price_sale_lend_price BETWEEN ${price_sale_lend_price_min_rent} AND  ${price_sale_lend_price_max_rent} `;
    }

    if (product_replacement_price && product_replacement_price.length > 0) {
      let newReplacementPrice = product_replacement_price
        .map((price) => `'${price}'`)
        .join(",");
      where += ` AND p.product_replacement_price IN(${newReplacementPrice})`;
    }

    if (product_rental_period && product_rental_period.length > 0) {
      let newRentalPeriod = product_rental_period
        .map((period) => `'${period}'`)
        .join(",");
      where += ` AND p.product_rental_period IN(${newRentalPeriod})`;
    }

    if (product_description && product_description.length > 0) {
      let newDescription = product_description
        .map((desc) => `'${desc}'`)
        .join(",");
      where += ` AND p.product_description IN(${newDescription})`;
    }

    if (product_buy_rent && product_buy_rent.length > 0) {
      let newBuyRent = product_buy_rent
        .map((buyrent) => `'${buyrent}'`)
        .join(",");
      where += ` AND p.product_buy_rent IN(${newBuyRent})`;
    }

    if (size_standard && size_standard.length > 0) {
      let newSizeStandard = size_standard
        .map((standard) => `'${standard}'`)
        .join(",");
      where += ` AND p.size_standard IN(${newSizeStandard})`;
    }

    const query = `
    SELECT
    p.id,
      p.seller_id,
      pb.product_brand,
      pc.product_category,
      pco.product_color,
      ps.size_top,
      ps.size_bottom,
      p.size_standard,
      pst.style_top,
      pst.style_bottom,
      pbi.billing_type,
      pbi.billing_level,
      pbi.billing_condition,
      p.product_buy_rent,
      pp.product_padding,
      p.location,
      p.price_sale_lend_price,
      p.product_replacement_price,
      p.product_rental_period,
      p.product_description,
      p.wishlist_like,
      p.product_type,
      p.created_at,
      p.updated_at,
      GROUP_CONCAT(DISTINCT pcn.product_color) AS product_colors,
        GROUP_CONCAT(DISTINCT pi.product_image) AS product_images
    FROM
    product p
    LEFT JOIN
    product_brands pb ON p.id = pb.product_id
    LEFT JOIN
    product_category pc ON p.id = pc.product_id
    LEFT JOIN
    product_colors pco ON p.id = pco.product_id
    LEFT JOIN
    product_size ps ON p.id = ps.product_id
    LEFT JOIN
    product_styles pst ON p.id = pst.product_id
    LEFT JOIN
    product_billing pbi ON p.id = pbi.product_id
    LEFT JOIN
    product_padding pp ON p.id = pp.product_id
    LEFT JOIN
    product_colors pcn ON p.id = pcn.product_id
    LEFT JOIN
    product_images pi ON p.id = pi.product_id
    ${where}
    GROUP BY
    p.id,
      p.seller_id,
      pb.product_brand,
      pc.product_category,
      pco.product_color,
      ps.size_top,
      ps.size_bottom,
      p.size_standard,
      pst.style_top,
      pst.style_bottom,
      pbi.billing_type,
      pbi.billing_level,
      pbi.billing_condition,
      p.product_buy_rent,
      pp.product_padding,
      p.location,
      p.price_sale_lend_price,
      p.product_replacement_price,
      p.product_rental_period,
      p.product_description,
      p.wishlist_like,
      p.created_at,
      p.updated_at
    ORDER BY
    p.id DESC
      `;
    console.log("Constructed Query:", query);
    return db.query(query);
  },
  getAllProduct_by_category: async (productCategory) => {
    return db.query(`SELECT * FROM product where product_category = '${productCategory}'`);
  },
};
