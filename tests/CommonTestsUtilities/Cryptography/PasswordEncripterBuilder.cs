using CashFlow.Domain.Security.Cryptography;
using Moq;

namespace CommonTestsUtilities.Cryptography;
public class PasswordEncryptorBuilder
{
    private readonly Mock<IPasswordEncryptor> _mock;

    public PasswordEncryptorBuilder()
    {
        _mock = new Mock<IPasswordEncryptor>();

        _mock.Setup(passwordEncryptor => passwordEncryptor.Encrypt(It.IsAny<string>())).Returns("dhw8?23e9ç^qd!");
    }

    public PasswordEncryptorBuilder Verify(string? password)
    {
        if(string.IsNullOrWhiteSpace(password) == false)
            _mock.Setup(passwordEncryptor => passwordEncryptor.Verify(password, It.IsAny<string>())).Returns(true);
        return this;
    }

    public IPasswordEncryptor Build() => _mock.Object;
}
