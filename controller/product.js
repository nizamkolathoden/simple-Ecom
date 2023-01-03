const Product = require("../model/product");
const BigPromise = require("../midleware/BigPromise");
const cloudinary = require("cloudinary");
const WhereClause = require("../util/simpleClause");

//product
exports.addProduct = BigPromise(async (req, res) => {
  let imageArray = [];

  if (!req.files) {
    return res.status(401).json({ error: "Images are Required" });
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        id: result.asset_id,
        secure_url: result.secure_url,
      });
    }
    console.log(imageArray);
  }
  req.body.photos = imageArray;
  req.body.user = req.user.id;
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    newProduct,
  });
});

exports.getAllProduct = BigPromise(async (req, res) => {
  const resultPerPage = 6;

  const totalCount = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  console.log(productsObj);
  let products = await productsObj.base.clone();
  const filteredProductNumber = products.length;
  productsObj.pager(resultPerPage);

  products = await productsObj.base;
  res.json({
    products,
    totalCount,
    filteredProductNumber,
  });
});

exports.getOneProduct = BigPromise(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product Not Found" });

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.updateProduct = BigPromise(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product Not Found" });

    let imageArray = [];

    if (req.files) {
      //destory exisiting img

      for (let index = 0; index < product.photos.length; index++) {
        await cloudinary.v2.uploader.destroy(product.photos[index].id);
      }

      //upload and save img
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: process.env.floderName,
          }
        );

        imageArray.push({
          id: result.asset_id,
          secure_url: result.secure_url,
        });
      }
      console.log(imageArray);
      req.body.photos = imageArray;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({ updatedProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.deleteProduct = BigPromise(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product Not Found" });

    for (let index = 0; index < product.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    await product.remove();
    res.json("Deleted Product !");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//reviews

exports.addReview = BigPromise(async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const prodct = await Product.findById(productId);

    const AlreadyReviwed = prodct.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    console.log(AlreadyReviwed);
    if (AlreadyReviwed) {
      AlreadyReviwed.comment = comment;
      AlreadyReviwed.rating = rating;
    } else {
      prodct.reviews.push(review);
      prodct.numberOfReviews = prodct.numberOfReviews + 1;
    }

    //adjust rating

    prodct.ratings =
      prodct.reviews.reduce((acc, item) => {
        console.log("item", item);
        return item.rating + acc;
      }, 0) / prodct.reviews.length;

    await prodct.save({ validateBeforeSave: false });
    res.json("review added");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.dleteReview = BigPromise(async (req,res) => {
  try {
    const {productId} = req.query;
    const prodct = await Product.findById(productId)

  const reviews = prodct.reviews.filter(
    (rev) => rev.user.toString() !== req.user._id.toString()
  );

  const numberOfReviews = reviews.length;
  const rating =
    reviews.reduce((acc, item) => {
      return item.rating + acc;
    }, 0) / prodct.reviews.length;

  const UpdatedReview = await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      numberOfReviews,
      rating,
    },
    {
      new: true,
    }
  );

  res.json(UpdatedReview)
  //not possible bcz updating numberOfReviews and ratting is complex below method
  // const UpdatedReview1 =  await Product.findByIdAndUpdate(productId,{
  //  $pull:{ reviews: {user: req.user._id} },
  // },{
  //   new:true
  // })
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Internal Server Error"})
  }
  
});
