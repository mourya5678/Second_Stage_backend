const db = require("../utils/database");

module.exports = {

  createRenterIssue: async (data) => {
    return db.query('INSERT INTO renter_issue set ?', [data])
  },

  createLenderIssue: async (data) => {
    return db.query('INSERT INTO lender_issue set ?', [data]);
  },

  createBuyerIssue: async (data) => {
    return db.query('INSERT INTO buyer_issue set ?', [data]);
  },


  registerUser: (async (user) => {
    return db.query('insert into tbl_buyer set ?', [user]);
  }),

  buyer_issue_image: async (filename, product_id) => {
    return db.query(`Update buyer_issue set buyer_issue_image='${filename}' where id=${product_id}`)
  },

  renter_issue_image: async (filename, product_id) => {
    return db.query(`Update renter_issue set renter_issue_image='${filename}' where id=${product_id}`)
  },

  lender_issue_image: async (filename, product_id) => {
    return db.query(`Update lender_issue set lender_issue_image='${filename}' where lender_id=${product_id}`)
  },

  register_seller: (async (user) => {
    return db.query('insert into tbl_seller set ?', [user]);
  }),

  fetchUserByEmail: async (email) => {
    return db.query("select * from tbl_buyer where email = ?", [email]);
  },

  fetchsellerByEmail: async (email) => {
    return db.query("select * from tbl_seller where email = ?", [email]);
  },

  fetchUserByStatus: async (email) => {
    return db.query("select * from tbl_buyer where email = ?", [email]);
  },

  fetchUserByPhone_number: async (phone_number) => {
    return db.query("select * from tbl_buyer where phone_number = ?", [
      phone_number,
    ]);
  },

  updateToken: async (token, email, act_token) => {
    return db.query("Update tbl_buyer set token= ? where email=?", [
      token,
      email,
      act_token,
    ]);
  },

  fetchUserByActToken: async (act_token) => {
    return db.query("select * from tbl_buyer where act_token = ?", [act_token]);
  },



  updateUser: async (token, email) => {
    return db.query("Update tbl_buyer set token=? where email=?", [token, email]);
  },
  updateUser_1: async (seller_card_number, user_id) => {
    return db.query(`Update tbl_buyer set seller_card_number= '${seller_card_number}' , seller = 1 where id ='${user_id}'`)
  },

  update_guest_cart: async (new_user_id, guest_token) => {
    return db.query(`Update cart set buyer_id='${new_user_id}' where buyer_id ='${guest_token}'`);
  },

  update_guest_whislist: async (new_user_id, guest_token) => {
    return db.query(`Update product_wishlist set buyer_id= '${new_user_id}' where buyer_id ='${guest_token}'`);
  },

  updateUserByActToken: async (token, act_token, id) => {
    return db.query(
      `Update tbl_buyer set verify_user = 1, token = ?, act_token = ? where id = ?`,
      [token, act_token, id]
    );
  },


  fetchUserByToken: async (token) => {
    return db.query("select * from tbl_buyer where token = ?", [token]);
  },

  updatePassword: async (password, token) => {
    return db.query("Update tbl_buyer set password= ? where token=?", [
      password,
      token,
    ]);
  },

  fetchUserById: async (id) => {

    return db.query(" select * from tbl_buyer where id= ?", [id]);
  },

  fetchUserByIdtoken: async (id) => {

    return db.query(`select * from tbl_buyer where token = '${id}' `, [id]);
  },

  fetchUserBy_Id: async (id) => {
    return db.query(`select * from tbl_buyer where id= '${id}'`, [id]);
  },

  updateUserById: async (user, user_id) => {
    return db.query(
      ` Update tbl_buyer SET license_number='${user.license_number}',license_state='${user.license_state}' ,
      phone_number='${user.phone_number}',profile_image='${user.profile_image}',
      buyer_name='${user.buyer_name}',user_name='${user.user_name}'
       where id='${user_id}' `
    );
  },

  // updateUserById: (async (user,user_id) => {
  //     return db.query(`Update tbl_buyer(username) VALUES('${user.username}')`,
  //      [user.username]);
  // }),

  updateUserbyPass: async (password, user_id) => {
    return db.query("Update tbl_buyer set password=? where  id =?", [
      password,
      user_id,
    ]);
  },

  updateUserbyPass_1: async (password, show_password, user_id) => {
    return db.query("Update tbl_buyer set password=? , show_password = ? where  id =?", [
      password, show_password,
      user_id
    ]);
  },

  fetchTokenOfUser: async (token) => {
    return db.query("select * from tbl_buyer where token=?", [token]);
  },

  fetchdeshboard: async () => {
    return db.query("select * from dashboard");
  },

  verify_phone_no: async (phone_number) => {
    return db.query("select * from tbl_buyer where phone_number=?", [phone_number]);
  },

  // fetchsignalsANDsymbol: (async (formattedDate,user_id) => {
  //     return db.query('select * from signals where signals_time =? AND user_id=?', [formattedDate,user_id]);
  // }),



  updatePassword_1: async (password, token) => {
    return db.query("Update tbl_buyer set show_password = ? where token=?", [
      password,
      token,
    ]);
  },

  get_all_users: async () => {
    return db.query("select * from tbl_buyer ORDER BY `id` DESC");
  },


  delete_User: async (user_id) => {
    return db.query(`delete  from tbl_buyer where id='${user_id}' `);
  },

  registerUser_1: async (email, username, phone_number, now) => {
    return db.query(
      `insert into tbl_buyer(username,email,phone_number,timezone) VALUES('${username}','${email}','${phone_number}','${now}')`,
      [username, email, phone_number, now]
    );
  },


  phone_no_check: async (phone_number) => {
    return db.query(
      `select * from  tbl_buyer  where phone_number='${phone_number}'`
    );
  },
  verifyUser: async (user_id) => {
    return db.query(`update tbl_buyer SET verify_user = "1" where id='${user_id}'`);
  },

  verify_status: async (phone_number) => {
    return db.query(
      `Update tbl_buyer set phone_verify = 1 where phone_number='${phone_number}'`
    );
  },
  phone_Check: async (phone_number) => {
    return db.query(`select * from tbl_buyer where phone_number='${phone_number}'`);
  },
  username_Check: async (user_name, user_id) => {
    return db.query(`select * from tbl_buyer where user_name='${user_name}' AND id !='${user_id}'`);
  },

  insert_Links: async (links) => {
    return db.query('insert into social_media set ? ', [links]);
  },

  delete_actToken: async (user_id) => {
    return db.query(`update tbl_buyer  set act_token = "" where id='${user_id}'`);
  },

  verify_otp: async (OTP, email) => {
    return db.query(`select * from  tbl_buyer  where OTP='${OTP}' AND email = '${email}' `);
  },

  Delete_otp: async (OTP, email) => {
    return db.query(` update tbl_buyer set OTP = 0, where email = '${email}' `);
  },

  updateUserBy_ActToken: async (token, act_token, email) => {
    return db.query(
      `Update tbl_buyer set verify_user = 1,OTP = 0, token = ?, act_token = ? where email = ?`,
      [token, act_token, email]
    );
  },
};
