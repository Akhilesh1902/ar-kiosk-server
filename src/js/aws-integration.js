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

  async readObject(Key, socket) {
    const data = this.s3.getObject({ Bucket, Key }, (err, data) => {
      console.log({ Bucket, Key });
      if (err) {
        console.error('error while getting data from the server');
        // console.log(err);
      }
      if (data) {
        console.log('data successfully fetched');
        socket?.emit('get_file', { Data: data.Body });
        return data.Body;
      }
    });
    // console.log(data);
    return data;
  }
  async getFile(Key) {
    console.log({ Bucket, Key });
    return new Promise((resolve, reject) => {
      this.s3.getObject({ Bucket, Key }, (err, data) => {
        if (data) resolve({ modelName: Key, model: data.Body });
        else reject();
      });
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
