import { eCollections } from './enums';

export class ItemsDataBase {
    client: any;
    database: any;
    userProfiles: any;
    userDevice: any;
    billing: any;
    databaseName = 'app';

    constructor(client: any) {
        if (client !== undefined) {
            this.client = client;
            // Access the specified database and collection
            this.database = this.client.db(this.databaseName);
            this.userProfiles = this.database.collection(eCollections.eUserProfiles);
            this.userDevice = this.database.collection(eCollections.eUserDevice);
            this.billing = this.database.collection(eCollections.eBilling); 
        }
    }

    async start(): Promise<void> {
    }

    // retrieve all documents in the collection
    async getCollection(collectionName: string) {
    let currentCollection: any = undefined;
    switch (collectionName) {
        case eCollections.eUserProfiles:
            currentCollection = this.userProfiles;
            break;

        case eCollections.eUserDevice:
            currentCollection = this.userDevice;
            break;

        case eCollections.eBilling:
            currentCollection = this.billing;
            break;

        default:
            return false;
            break;
    }
    if (currentCollection === undefined) {
        return false;
    }
    const documents = await currentCollection.find({}).toArray();
    console.log('Retrieved documents:', documents);
    }
}