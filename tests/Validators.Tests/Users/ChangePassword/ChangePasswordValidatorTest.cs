using CashFlow.Application.UseCases.Users.SharedValidator;
using CashFlow.Exception;
using CommonTestsUtilities.Requests;
using FluentAssertions;

namespace Validators.Tests.Users.ChangePassword;
public class ChangePasswordValidatorTest
{
    [Fact]
    public void Success()
    {
        var request = RequestChangePasswordJsonBuilder.Build();

        var validator = new ChangePasswordValidator();

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Error_New_password_Empty(string newPassword)
    {
        var request = RequestChangePasswordJsonBuilder.Build();
        request.NewPassword = newPassword;

        var validator = new ChangePasswordValidator();

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().ContainSingle().And.Contain(e => e.ErrorMessage.Equals(ResourceErrorMessages.INVALID_PASSWORD));
    }
}
