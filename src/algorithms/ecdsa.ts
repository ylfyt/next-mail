import Sha3 from './sha3';
import { 
  encodeSignature,
  decodeSignature,
  encodePrivateKey,
  decodePrivateKey,
  encodePublicKey,
  decodePublicKey } from './encoderDecoder';



// ============= ECDSA =============

// curve : ax^2 + y^2  = 1 + dx^2y^2
// ed25519

const base: [bigint, bigint] = [
  15112221349535400772501151409588531511454012693041857206046113283949847762202n,
  46316835694926478169428394003475163141307993866256225615783033603165251855960n,
];
const p: bigint = 2n ** 255n - 19n;
const a = BigInt(-1);
const d = findPositiveModulus(BigInt(-121665) * findModInverse(121666n, p)!, p);



function findPositiveModulus(a: bigint, p: bigint): bigint {
  if (a < 0n) {
    a = (a + p * BigInt(Math.floor(Math.abs(Number(a)) / Number(p))) + p) % p;
  }
  return a;
}

function textToInt(text: string): bigint {
  const encodedText: Uint8Array = new TextEncoder().encode(text);
  const hexText: string = Array.prototype.map
    .call(encodedText, (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
  const intText: bigint = BigInt('0x' + hexText);
  return intText;
}

function gcd(a: bigint, b: bigint): bigint {
  while (a !== 0n) {
    [a, b] = [b % a, a];
  }
  return b;
}

function findModInverse(a: bigint, m: bigint): bigint | null {
  if (a < 0n) {
    a = (a % m + m) % m; // ensure that a is smaller than m
    a = (a + m * BigInt(Math.floor(Math.abs(Number(a)) / Number(m))) + m) % m;
  }
  // no mod inverse if a & m aren't relatively prime
  if (gcd(a, m) !== 1n) {
    return null;
  }
  // Calculate using the Extended Euclidean Algorithm:
  let u1: bigint = 1n,
    u2: bigint = 0n,
    u3: bigint = a,
    v1: bigint = 0n,
    v2: bigint = 1n,
    v3: bigint = m;

  while (v3 !== 0n) {
    const q: bigint = u3 / v3;
    [v1, v2, v3, u1, u2, u3] = [
      u1 - q * v1,
      u2 - q * v2,
      u3 - q * v3,
      v1,
      v2,
      v3,
    ];
  }

  return findPositiveModulus(u1, m);
}


function applyDoubleAndAddMethod(P: [bigint, bigint], k: bigint, a: bigint, d: bigint, mod: bigint): [bigint, bigint] {
  let additionPoint: [bigint, bigint] = [P[0], P[1]];
  const kAsBinary: string = k.toString(2); // Convert k to binary
  
  for (let i = 1; i < kAsBinary.length; i++) {
    const currentBit = kAsBinary.charAt(i);

    // always apply doubling
    additionPoint = pointAddition(additionPoint, additionPoint, a, d, mod);

    if (currentBit === '1') {
      // add base point
      additionPoint = pointAddition(additionPoint, P, a, d, mod);
    }
  }

  return additionPoint;
}

function pointAddition(P: [bigint, bigint], Q: [bigint, bigint], a: bigint, d: bigint, mod: bigint): [bigint, bigint] {
  const x1: bigint = P[0];
  const y1: bigint = P[1];
  const x2: bigint = Q[0];
  const y2: bigint = Q[1];

  const u: bigint = 1n + d * x1 * x2 * y1 * y2;
  const v: bigint = 1n - d * x1 * x2 * y1 * y2;
  const uInverse: bigint | null = findModInverse(u, mod);
  const vInverse: bigint | null = findModInverse(v, mod);

  if (uInverse === null || vInverse === null) {
    throw new Error("Cannot calculate point addition: invalid input");
  }

  const x3: bigint = ((x1 * y2 + y1 * x2) % mod) * uInverse % mod;
  const y3: bigint = ((y1 * y2 - a * x1 * x2) % mod) * vInverse % mod;

  return [x3, y3];
}


// hashing the message
function hashing(message: string): bigint {
  // const hash = sha512(message);
  const hash = Sha3.hash512(message);

  const bigIntHash = BigInt('0x' + hash);
  return bigIntHash;
}

// generate public key
export function generatePublicKey(privateKey: bigint): [bigint, bigint]{
  const publicKey = applyDoubleAndAddMethod(base, privateKey, a, d, p);
  return publicKey;
}


// generate signature
export function signing(message: string, publicKey: [bigint, bigint], privateKey: bigint): [bigint, bigint] {
  const messageInt = textToInt(message);
  const r = hashing(String(hashing(String(messageInt)) + messageInt)) % p;
  const R = applyDoubleAndAddMethod(base, r, a, d, p);
  const h = hashing(String(R[0] + publicKey[0] + messageInt)) % p; // menggunakan teknik compression
  // const h = hashing(String(R[0] + publicKey[0] + publicKey[1] + messageInt)) % p;
  // % p
  const s = (r + h * privateKey);
  
  return [r, s];
}

// verification signature
export function verify(message: string, r: bigint, sign: bigint, publicKey: [bigint, bigint]):boolean{

  // hashing
  const messageInt = textToInt(message);
  const R = applyDoubleAndAddMethod(base, r, a, d, p);
  const h = hashing(String(R[0] + publicKey[0] + messageInt)) % p; // menggunakan teknik compression
  // const h = hashing(String(R[0] + publicKey[0] + publicKey[1] + messageInt)) % p;
  
  // verify
  const P1 = applyDoubleAndAddMethod(base, sign, a, d, p);
  const P2 = pointAddition(R, applyDoubleAndAddMethod(publicKey, h, a, d, p), a, d, p);
  
  // checking
  if (P1[0] == P2[0] && P1[1] == P2[1]) {
    // Signature is valid
    return true;
  }
  // Signature violation detected
  return false;

}


// Final Test (Skenario)

// console.log("\n=========== Message Pengirim ===========\n");
// const message = "Hello World aku Mochammad Fatchur Rochman";
// console.log("Message: ", message);

// console.log("\n=========== Key Generation ===========\n");
// // const privateKey: bigint = generatePrivateKey();
// const privateKey: bigint = 47379675103498394144858916095175689n;
// const publicKey: [bigint,bigint] = generatePublicKey(privateKey);
// console.log("private key: ", privateKey);
// console.log("\npublic key: ", publicKey);

// console.log("\n=========== EncodingKey ===========\n");
// const privateKeyEncoded = encodePrivateKey(privateKey);
// const publicKeyEncoded = encodePublicKey(publicKey);
// console.log("private key encoded: ", privateKeyEncoded);
// console.log("\npublic key encoded: ", publicKeyEncoded);

// console.log("\n=========== Signing ===========\n");
// // di decode dulu
// const privateKeyDecoded = decodePrivateKey(privateKeyEncoded);
// const publicKeyDecoded = decodePublicKey(publicKeyEncoded);

// const signature  = signing(message, publicKeyDecoded, privateKeyDecoded);
// const signatureEncoded = encodeSignature(signature);
// console.log("Signature: ", signature);
// console.log("\nSignature Encoded: ", signatureEncoded); // ini yang ditempel ke email


// console.log("\n=========== Verification ===========\n");
// // sampai ke penerima, penerima punya public key, message, signature encoded
// console.log("Penerima punya informasi:\n");
// const message1 = "Hello World aku Mochammad Fatchur Rochman";

// console.log("message: ", message1);
// console.log("\nsignature yang ada di message: ", signatureEncoded);
// console.log("\npublic key yang di encoded: ", publicKeyEncoded);

// const publicKeyDecodedRecv = decodePublicKey(publicKeyEncoded);
// const signatureDecoded = decodeSignature(signatureEncoded);
// const r = signatureDecoded[0];
// const s = signatureDecoded[1];
// const valid = verify(message1, r, s, publicKeyDecodedRecv);

// if (valid){
//   console.log("signature benar");
// }else{
//   console.log("signature tidak benar");
// }