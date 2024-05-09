import { Injectable } from '@angular/core';
import { publicKey } from 'config';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private publicKeyPem: string;
  private privateKeyPem: string;

  private keyPair: forge.pki.KeyPair;

  constructor() {
    this.keyPair = forge.pki.rsa.generateKeyPair(2048);
    this.publicKeyPem = publicKey;
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
}
