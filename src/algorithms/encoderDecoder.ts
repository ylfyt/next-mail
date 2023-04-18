// Catatan : Kurva ed25519 memiliki panjang bytes signature yang fix length yaitu 32 bytes
// jadi kalo mau kompress signature tinggal tambahkan saja
// Bisa dipakai untuk public key juga

// import { generatePrivateKey } from "./privatekeyGenerator";

export function toHexSignature(signature: [bigint, bigint]): [string, string] {
  const r = signature[0].toString(16).padStart(64, '0');
  const s = signature[1].toString(16).padStart(64, '0');
  return [r, s];
}

// ================= Signature Encoding Decoding =================

export function encodeSignature(signature: [bigint, bigint]): string {
  const signatureHex = toHexSignature(signature);
  return signatureHex[0] + signatureHex[1];
}

export function decodeSignature(signature: string):  [bigint, bigint] {
  const rHex = signature.substring(0, 64);
  const sHex = signature.substring(64);
  const r = BigInt('0x' + rHex);
  const s = BigInt('0x' + sHex);
  return [ r, s ];
}

// ================= Public Key Encoding Decoding =================

export function encodePublicKey(publicKey: [bigint, bigint]): string {
  const publicKeyHex = toHexSignature(publicKey);
  return publicKeyHex[0] + publicKeyHex[1];
}

export function decodePublicKey(publicKeyEncoded: string): [bigint, bigint] {
  try {
    const rHex = publicKeyEncoded.substring(0, 64);
    const sHex = publicKeyEncoded.substring(64);
    const x = BigInt('0x' + rHex);
    const y = BigInt('0x' + sHex);
    return [x, y];
  } catch (error) {
    return [0n,0n];
  }
}

// ================= Private Key Encoding Decoding =================

export function encodePrivateKey(privateKey: bigint): string {
  const privateKeyEncoded = privateKey.toString(16).padStart(64, '0');
  return privateKeyEncoded;
}

export function decodePrivateKey(privateKeyEncoded: string): bigint {
  try {
    const privateKeyHex = privateKeyEncoded.substring(0, 64);
    const privateKeyDecoded = BigInt('0x' + privateKeyHex);
    return privateKeyDecoded;
  } catch (error) {
    return 0n;
  }

  
}


// // ================= Testing =================
// // signature
// const signature = '1a7fcd04640627a071a4afbb92d4b5f50e47effbcc756c569520798970ee5e9e4652c414207d2612030002acb1efef706dcf6790eae5ce9a518bfeaaba5098ed4bf706641c2e9a3ed236a658b3c72';
// const [ r, s ] = decodeSignature(signature);

// const signatureDecoded = decodeSignature(signature);
// console.log(signatureDecoded);
// const signatureEncoded = encodeSignature(signatureDecoded);
// console.log(signatureEncoded);

// console.log(`r: ${r.toString()}`);
// console.log(`s: ${s.toString()}`);


// // public key
// const publicKey: [bigint, bigint] = [
//   BigInt('27057085223206117608427093027376216273593585755383575915984231941399226442632'),
//   BigInt('66591094625030782663463859073332687452328822076044825900236776434008338443831')
// ]

// const publicKeyHex = toHexSignature(publicKey);
// console.log(publicKeyHex);

// const publicKeyString = encodePublicKey(publicKey);
// console.log(publicKeyString);
// const decodePublicKeyString = decodePublicKey(publicKeyString);
// console.log(decodePublicKeyString);

// // private key
// const privateKey = generatePrivateKey();
// console.log(privateKey);
// const privateKeyEncoded = encodePrivateKey(privateKey);
// console.log(privateKeyEncoded);
// const privateKeyDecoded = decodePrivateKey(privateKeyEncoded);
// console.log(privateKeyDecoded);