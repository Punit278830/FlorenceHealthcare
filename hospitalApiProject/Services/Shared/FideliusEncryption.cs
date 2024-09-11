using System.Security.Cryptography;

namespace hospitalApiProject.Services.Shared
{
  public class FideliusEncryption
  {
    // RSA Key Generation
    public (string PublicKey, string PrivateKey) GenerateRSAKeys()
    {
      using var rsa = RSA.Create(2048); // 2048 bits key size
      var publicKey = Convert.ToBase64String(rsa.ExportSubjectPublicKeyInfo());
      var privateKey = Convert.ToBase64String(rsa.ExportPkcs8PrivateKey());

      return (publicKey, privateKey);
    }

    // AES Key and Initialization Vector (IV) Generation
    public (byte[] Key, byte[] IV) GenerateAESKeyAndIV()
    {
      using var aes = Aes.Create();
      aes.GenerateKey();
      aes.GenerateIV();
      return (aes.Key, aes.IV);
    }

    // AES Encryption
    public string Encrypt(string plainText) //, byte[] key, byte[] iv)
    {
      var (key, iv) = GenerateAESKeyAndIV();
      using var aes = Aes.Create();
      aes.Key = key;
      aes.IV = iv;

      using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
      using var ms = new MemoryStream();
      using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
      using (var sw = new StreamWriter(cs))
      {
        sw.Write(plainText);
      }

      var encrypted = ms.ToArray();
      return Convert.ToBase64String(encrypted);
    }

    // AES Decryption
    public string Decrypt(string encryptedText, byte[] key, byte[] iv)
    {
      var cipher = Convert.FromBase64String(encryptedText);

      using var aes = Aes.Create();
      aes.Key = key;
      aes.IV = iv;

      using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
      using var ms = new MemoryStream(cipher);
      using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
      using var sr = new StreamReader(cs);

      return sr.ReadToEnd();
    }
  }

}
