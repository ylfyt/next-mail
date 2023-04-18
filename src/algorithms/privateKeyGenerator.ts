import seedrandom from 'seedrandom';

export function generatePrivateKey(): bigint {
  const rng = seedrandom();
  const bytes = new Uint8Array(32);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(rng() * 256);
  }
  const hexString = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  return BigInt('0x' + hexString);
}
