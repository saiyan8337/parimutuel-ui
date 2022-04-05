const AWS = require("aws-sdk");
const fs = require("fs");
const async = require("async");
const mkdirp = require("mkdirp");

// require("dotenv").config({ path: __dirname + "/../.env" });

const filePath = "./public/library/";

AWS.config.update({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2",
});
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
});
const listParams = {
  Bucket: "trading-view-library",
};

mkdirp("./public/library/charting_library/bundles");
mkdirp("./public/library/datafeeds/udf/dist");
mkdirp("./public/library/datafeeds/udf/lib");
mkdirp("./public/library/datafeeds/udf/src");

s3.listObjectsV2(listParams, (err, data) => {
  if (err) console.log(err);

  async.each(
    data.Contents,
    function iterator(item, callback) {
      // allow 5 simultaneous downloads
      if (item.Size == 0) {
        callback();
        return;
      }
      var getParams = {
        Bucket: "trading-view-library",
        Key: item.Key,
      };

      s3.getObject(getParams, async (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(filePath + item.Key, data.Body.toString());
        console.log(`${filePath + item.Key} has been created!`);
      });
    },
    function done(err) {
      if (err) {
        return console.log(err);
      }

      console.log("Downloads Done.");
    },
  );
});
