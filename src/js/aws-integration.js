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

  uploadObject(buff, fileAddr) {
    console.log('uploading data to aws');
    this.uploadParams.Body = buff;
    this.uploadParams.Key = fileAddr;
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

  readObject() {
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

  deleteObject(Key) {
    console.log(Key);
    this.s3.deleteObject({ Bucket, Key }, (err, data) => {
      if (err) {
        console.log('error deleting in AWS ', err);
      } else {
        console.log('successfully deleted ', data);
        console.log(data);
      }
    });
  }
}
