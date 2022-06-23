import { MongoClient } from 'mongodb';

export class MongoClientConnection {
  constructor() {
    this.URI = process.env.MONGO_DB_CONNECTION_URL;
    this.client = new MongoClient(this.URI);
    this.connect();
  }

  async connect() {
    console.log('connectiong to mongo');
    try {
      await this.client.connect();
      this.collection = this.client.db('ar-kiosk').collection('kiosk-images');
    } catch (er) {
      console.log(er);
    } finally {
      // await this.client.close();
    }
  }
  async disconnect() {
    // await this.client.close();
  }

  async getAllImages() {
    // const result = this.client.db('ar-kiosk').collection('kiosk-images').find();
    const result = await this.collection.find();
    const resArray = await result.toArray();

    return resArray;
  }

  async updateImages(imageData) {
    const { name, scale, pos, addr: url, thumbnailUrl: thumbUrl } = imageData;
    console.log('updating to mongo');
    console.log(imageData);
    const res = await this.collection.updateOne(
      { name },
      { $set: { url, scale, pos, thumbUrl } },
      { upsert: true }
    );

    return res;
  }

  async deleteImage(name) {
    const res = await this.collection.deleteOne({ name });
    return res;
  }
}
