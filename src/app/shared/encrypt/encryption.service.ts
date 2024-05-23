import { Injectable } from '@angular/core';
import { publicKey, publicKey_PHR } from 'config';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private publicKeyPem: string;
  private publicKeyPHRPem: string;

  private privateKeyPem: string;

  private keyPair: forge.pki.KeyPair;

  constructor() {
    this.keyPair = forge.pki.rsa.generateKeyPair(2048);
    this.publicKeyPem = publicKey;
    this.publicKeyPHRPem = publicKey_PHR;

    this.privateKeyPem = "-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----";
  }

  encrypt(message: string) : string {
    let publicKey = forge.pki.publicKeyFromPem(this.publicKeyPem);
    let data = publicKey.encrypt(message, 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create(),
      },
    });

    return forge.util.encode64(data);
  }

  decrypt(encrtpted: string) : string {
    let privateKey = forge.pki.privateKeyFromPem(this.privateKeyPem);
    return privateKey.decrypt(encrtpted, 'RSA-OAEP', {
      md: forge.md.sha1.create(),
      mgf1: {
        md: forge.md.sha1.create(),
      },
    });
  }

  encryptWithPKCS1(message: string) : string {
    const publicKey = forge.pki.publicKeyFromPem(this.publicKeyPHRPem);
    const messageBytes = forge.util.createBuffer(message, 'utf8');

    const encrypted = publicKey.encrypt(messageBytes.getBytes(), 'RSAES-PKCS1-V1_5');
    const encryptedBase64 = forge.util.encode64(encrypted);
    return encryptedBase64;
  }

}
