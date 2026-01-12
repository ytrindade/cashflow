using CashFlow.Application.UseCases.Users.SharedValidator;
using CashFlow.Communication.Requests;
using CashFlow.Exception;
using CommonTestsUtilities.Requests;
using FluentAssertions;
using FluentValidation;

namespace Validators.Tests.Users;
public class PasswordValidatorTest
{
    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    [InlineData("a")]
    [InlineData("aa")]
    [InlineData("aaa")]
    [InlineData("aaaa")]
    [InlineData("aaaaa")]
    [InlineData("aaaaaa")]
    [InlineData("aaaaaaa")]
    [InlineData("aaaaaaaa")] //lower
    [InlineData("AAAAAAAA")] //Upper
    [InlineData("Aaaaaaaa")] //Number
    [InlineData("Aaaaaaaa1")] //Special
    public void Error_Password_Empty(string password)
    {
        var validator = new PasswordValidator<RequestRegisterUserJson>();

        var result = validator.IsValid(new ValidationContext<RequestRegisterUserJson>(new RequestRegisterUserJson()), password);

        result.Should().BeFalse();
    }
}
