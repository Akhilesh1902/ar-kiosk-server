import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const Bucket = 'ar-kiosk-tutar';

export class AwsInstance {
  constructor() {
    this.connect();
    this.uploadParams = { Bucket, Key: '', Body: '' };
  }

  connect() {
    this.s3 = new AWS.S3({
      region: 'ap-south-1',
      accessKeyId: process.env.AWS_ACCESS_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY,
    });
  }

  uploadData(fileAddr) {
    console.log('uploading data to aws');
    console.log(fileAddr);

    let fileStream = fs.readFileSync(fileAddr);

    console.log(fileStream);

    this.uploadParams.Body = fileStream;
    this.uploadParams.Key = path.basename(fileAddr);
    console.log(this.uploadParams);
    this.s3.upload(this.uploadParams, (err, data) => {
      if (err) {
        console.log('Upload Error', err);
      }
      if (data) {
        console.log('Upload Success', data.Location);
      }
    });

    // console.log(this.uploadParams);
  }

  readData() {
    const data = this.s3.getObject({ Bucket, Key: 't.png' }, (err, data) => {
      if (err) {
        console.log('error while getting data from the server');
        console.log(err);
      }
      if (data) {
        console.log('data successfully fetched');
        console.log(data);
      }
    });
  }
}
