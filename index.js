const { json } = require("express");
let app = require("./routes/route");
let multer = require("multer");
let { database, adminmodel, usermodel } = require("./database/mongo");
const express = require("express");
let session = require("express-session");
let bcrypt = require("bcrypt");

app.use(
  session({
    secret: "hello bro",
    resave: false,
    saveUninitialized: false,
  })
);

let photo = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/importedimg");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + Date.now() + ".jpg");
    },
  }),
}).single("file");

app.post("/senddata", photo, (req, res) => {
  let {
    street,
    city,
    province,
    price,
    rooms,
    square,
    describe,
    phnum,
    sellrent,
  } = req.body;
  let photo = req.file.filename;
  let total = {
    street: street,
    city: city,
    province: province,
    price: price,
    rooms: rooms,
    square: square,
    describe: describe,
    phnum: phnum,
    photo: photo,
    sellrent: sellrent,
  };

  let final = new adminmodel(total);
  try {
    final.save();
    res.redirect("/sell");
    // res.status(200).send("saved successfully");
  } catch (err) {
    console.log("error is :" + err.status);
    res.status(500).send("please try again ");
  }
});
app.post("/moreinfo", (req, res) => {
  let { photo, price, square, rooms, phnum, street, city, province, describe } =
    req.body;
  let product = {
    photo: photo,
    price: price,
    square: square,
    rooms: rooms,
    phnum: phnum,
    street: street,
    city: city,
    province: province,
    describe: describe,
  };
  req.session.info = product;
  res.redirect("/product");
});
app.post("/searchinfo", (req, res) => {
  let getsearch = req.body.search;
  req.session.search = getsearch;
  res.redirect("/");
});
app.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let perpage = 8;
  let searchget = req.session.search;
  let totalitem = await database.find({
    $or: [
      { province: { $regex: String(searchget) } },
      { city: { $regex: String(searchget) } },
      { street: { $regex: String(searchget) } },
    ],
  });
  let item = await database
    .find({
      $or: [
        { province: { $regex: String(searchget) } },
        { city: { $regex: String(searchget) } },
        { street: { $regex: String(searchget) } },
      ],
    })
    .skip((page - 1) * perpage)
    .limit(perpage);
  let sum = 0;
  for (let i = 0; i < totalitem.length; i++) {
    sum = i;
  }
  let count = sum + 1;
  let total = Math.ceil(count / perpage);
  res.render("main", { item, total, page });
});

app.get("/product", (req, res) => {
  let info = req.session.info;
  res.render("product", { info });
});
app.get("/buy", async (req, res) => {
  if (req.session.srch) {
    let info = req.session.srch;
    let pcity = info.pcity;
    let room = parseInt(info.rooms);
    let minprice = parseInt(info.minprice);
    let page = parseInt(req.query.page) || 1;
    let perpage = 8;

    let result = await database.find({
      $or: [{ province: { $regex: pcity } }, { city: { $regex: pcity } }],
    });

    let array = result;
    let startindex = (page - 1) * perpage;
    let endindex = page * perpage;
    let final = array.filter((item) => {
      return (
        item.rooms == room && item.price <= minprice && item.sellrent === "Sell"
      );
    });
    let count = 0;
    for (let i = 0; i < final.length; i++) {
      count = i;
    }
    let total = Math.ceil((count + 1) / perpage);
    console.log(total);
    let item = final.slice(startindex, endindex);

    res.render("buy", {
      page,
      item,
      total,
    });
  } else {
    let item = "";
    res.render("buy", { item });
  }
});
app.post("/searchbuy", (req, res) => {
  let { pcity, rooms, minprice } = req.body;
  let info = {
    pcity: pcity,
    rooms: rooms,
    minprice: minprice,
  };
  req.session.srch = info;
  res.redirect("/buy");
});
app.post("/searchrent", (req, res) => {
  let { pcity, rooms, minprice } = req.body;
  let info = {
    pcity: pcity,
    rooms: rooms,
    minprice: minprice,
  };
  req.session.srchrent = info;
  res.redirect("/rent");
});

app.get("/rent", async (req, res) => {
  if (req.session.srchrent) {
    let info = req.session.srchrent;
    let pcity = info.pcity;
    let room = parseInt(info.rooms);
    let minprice = parseInt(info.minprice);
    let page = parseInt(req.query.page) || 1;
    let perpage = 8;

    let result = await database.find({
      $or: [{ province: { $regex: pcity } }, { city: { $regex: pcity } }],
    });

    let array = result;
    let startindex = (page - 1) * perpage;
    let endindex = page * perpage;
    let final = array.filter((item) => {
      return (
        item.rooms == room && item.price <= minprice && item.sellrent === "Rent"
      );
    });
    let count = 0;
    for (let i = 0; i < final.length; i++) {
      count = i;
    }
    let total = Math.ceil((count + 1) / perpage);
    let item = final.slice(startindex, endindex);

    res.render("rent", {
      page,
      item,
      total,
    });
  } else {
    let item = "";
    res.render("rent", { item });
  }
});

app.get("/editwithme", async (req, res) => {
  let result = await adminmodel.find();
  let search = req.session.searchadmin;
  let searchpart = await database.find({
    $or: [
      { city: { $regex: String(search) } },
      { province: { $regex: String(search) } },
    ],
  });
  if (!req.session.userid) {
    res.send("unauthorized");
  } else {
    res.render("dashboard", { result, searchpart });
  }
});
app.post("/approve", async (req, res) => {
  let {
    id,
    photo,
    price,
    street,
    city,
    province,
    square,
    phnum,
    describe,
    rooms,
    sellrent,
  } = req.body;
  let total = {
    id: JSON.parse(id),
    photo: photo,
    price: Number(price),
    street: street,
    city: city,
    province: province,
    square: Number(square),
    phnum: Number(phnum),
    describe: describe,
    rooms: Number(rooms),
    sellrent: sellrent,
  };

  let result = new database(total);
  result.save();
  res.redirect("/editwithme");
  console.log(total.id);
  let check = await database.find({ id: total.id });
  if (check) {
    await adminmodel.deleteOne({ _id: total.id });
  }
});
app.post("/delete", async (req, res) => {
  let {
    id,
    photo,
    price,
    street,
    city,
    province,
    square,
    phnum,
    describe,
    rooms,
    sellrent,
  } = req.body;
  let total = {
    id: JSON.parse(id),
    photo: photo,
    price: Number(price),
    street: street,
    city: city,
    province: province,
    square: Number(square),
    phnum: Number(phnum),
    describe: describe,
    rooms: Number(rooms),
    sellrent: sellrent,
  };
  let deletecontent = await adminmodel.deleteOne({ _id: total.id });
  res.redirect("/editwithme");
});
app.post("/searchinfoadmin", (req, res) => {
  let search = req.body.search;
  req.session.searchadmin = search;
  res.redirect("/editwithme");
});
app.post("/deleteadmin", async (req, res) => {
  let idadmin = req.body.id;
  let deleteok = await database.deleteOne({ id: String(idadmin) });
  res.redirect("/editwithme");
});
async function createdefaultuser() {
  const emailexist = "monir.shekoyans5@gmail.com";
  const hashedpass = await bcrypt.hash("monir198321", 10);
  let create = await new usermodel({
    email: emailexist,
    password: hashedpass,
  });
  create.save();
}
// createdefaultuser();

app.post("/loginpage", async (req, res) => {
  let { username, password } = req.body;
  const user = await usermodel.findOne({ email: username });
  const paswordu = await bcrypt.compare(password, user.password);
  if (user && paswordu) {
    req.session.userid = user._id;
    res.redirect("/editwithme");
  } else {
    res.send("Try again");
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/daretologin");
});
app.listen(4000);
