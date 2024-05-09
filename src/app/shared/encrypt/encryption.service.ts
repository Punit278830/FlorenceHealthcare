import { Injectable } from '@angular/core';
import { Crypto } from '@peculiar/webcrypto';
import { publicKey } from 'config';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private _publicKey: any;
  private crypto = new Crypto();

  constructor() {
    this.getKey();
  }

  async getEncryptedString(data: string)
  {
    return this.arrayBufferToBase64(await this.encrypt(data));
  }

  async encrypt(data: string) {
    const encoded = new TextEncoder().encode(data);
    return await this.crypto.subtle.encrypt({
      name: "RSA-OAEP"
    },
      this._publicKey,
      encoded);
  }

  async decryptData(data: BufferSource, privateKey: CryptoKey) {
    const decrypted = await this.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  }

  private async getKey() {
    try {
      this._publicKey = await this.importPublicKey(publicKey);
    }
    catch (error) {
      console.error('error getting the key:', error);
    }
  }

  private async importPublicKey(pem: string) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);

    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = this.str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-1",
      },
      true,
      ["encrypt"],
    );
  }

  async generateKeyPair() {
    return await this.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-1"
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  private str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer){
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;

    for (let i=0; i< len; i++){
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
