import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encryptionKey:string='MH@milkharbor1234';

  encryptPassword(password:any){
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedValue = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(this.encryptionKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combinedData = iv.concat(encryptedValue.ciphertext);
    const encryptedPassword = combinedData.toString(CryptoJS.enc.Base64);
    return encryptedPassword;
  }

  decryptPassword(encryptedPassword: string){
    const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedPassword);
    const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4));
    const decryptedValue = CryptoJS.AES.decrypt(
      ciphertext.toString(CryptoJS.enc.Base64),
      CryptoJS.enc.Utf8.parse(this.encryptionKey),
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const decryptedPassword = decryptedValue.toString(CryptoJS.enc.Utf8);
    return decryptedPassword
  }
}
