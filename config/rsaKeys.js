import rsaKeygen from 'rsa-keygen';

let instance = null;

class rsaKeys {

  constructor() {
    this.store = {};
    instance = (!instance) ? this : instance;
    return instance;
  }
  
  addKeyWithId(id) {
    this.store[id] = rsaKeygen.generate();
    return this.store[id].public_key;
  }

  getKeyById(id) {
    return this.store[id];
  }

  removeKeyById(id) {
    return delete this.store[id];
  }

}

export default rsaKeys;
