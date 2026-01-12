using CashFlow.Domain.Security.Cryptography;
using BC = BCrypt.Net.BCrypt;

namespace CashFlow.Infrastructure.Security.Cryptography;
public class BCrypt : IPasswordEncryptor
{
    public string Encrypt(string password)
    {
        string hashedPassword = BC.HashPassword(password);

        return hashedPassword;
    }

    public bool Verify(string password, string passwordHash)
    {
        return BC.Verify(password, passwordHash);
    }
}
