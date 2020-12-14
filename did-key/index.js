
let Utils = Promise.all([
  import('./utils/ipfs.js'),
  import('./utils/nacl.js'),
  import('./utils/base58.js')
]).then(modules => {
  return {
    ipfs: globalThis.Ipfs,
    nacl: globalThis.nacl,
    base58: {
      encode: globalThis.base58,
      decode: globalThis.base58.decode
    }
  }
});

let methods = {
  async create(type){
    let did;
    let utils = await Utils;
    switch (type) {
      case 'ed25519':
      default:
        let keys = utils.nacl.sign.keyPair();
        let id = 'z' + utils.base58.encode(utils.ipfs.multicodec.addPrefix('ed25519-pub', keys.publicKey));
        did = {
          id: id,
          keys: {
            public: keys.publicKey,
            private: keys.secretKey
          }
        }
    }
    did.id = 'did:key:' + did.id;
    return did;
  }
}

globalThis.didKey = methods;

export default methods;
