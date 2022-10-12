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
      await this.client.connect().then(() => {
        console.log('connected successfully');
      });
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
    const { name, scale, pos, fileAddr, type, thumbAddr, thumb, chromaKey } =
      imageData;
    console.log('updating to mongo');
    const res = await this.collection.updateOne(
      { name },
      { $set: { fileAddr, scale, pos, thumbAddr, type, thumb, chromaKey } },
      { upsert: true }
    );

    return res;
  }
  async updateData(data) {
    const {
      name,
      thumbName,
      thumb,
      fileAddr,
      materialAddr,
      scale,
      DisplayName,
      type,
    } = data;
    const res = await this.collection.updateOne(
      { name },
      {
        $set: {
          thumbName,
          DisplayName,
          thumb,
          fileAddr,
          materialAddr,
          scale,
          type,
        },
      },
      { upsert: true }
    );
    // console.log(res);
  }
  async deleteImage(name) {
    const res = await this.collection.deleteOne({ name });
    return res;
  }
}
