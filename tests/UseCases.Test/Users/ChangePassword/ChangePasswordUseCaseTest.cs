using CashFlow.Application.UseCases.Users.ChangePassword;
using CashFlow.Communication.Requests;
using CashFlow.Domain.Entities;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using CommonTestsUtilities.Cryptography;
using CommonTestsUtilities.Entities;
using CommonTestsUtilities.LoggedUser;
using CommonTestsUtilities.Repositories;
using CommonTestsUtilities.Repositories.Users;
using CommonTestsUtilities.Requests;
using FluentAssertions;

namespace UseCases.Test.Users.ChangePassword;
public class ChangePasswordUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var loggedUser = UserBuilder.Build();

        var request = RequestChangePasswordJsonBuilder.Build();

        var useCase = CreateUseCase(loggedUser, request.CurrentPassword);

        var act = async () => await useCase.Execute(request);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task Error_New_Password_Empty()
    {
        var loggedUser = UserBuilder.Build();

        var request = RequestChangePasswordJsonBuilder.Build();
        request.NewPassword = string.Empty;

        var useCase = CreateUseCase(loggedUser, request.CurrentPassword);

        var act = async () => await useCase.Execute(request);

        var result = await act.Should().ThrowAsync<ErrorOnValidationException>();

        result.Where(e => e.GetErrors().Count.Equals(1) && e.GetErrors().Contains(ResourceErrorMessages.INVALID_PASSWORD));
    }

    [Fact]
    public async Task Error_Password_Does_Not_Match()
    {
        var loggedUser = UserBuilder.Build();

        var request = RequestChangePasswordJsonBuilder.Build();

        var useCase = CreateUseCase(loggedUser);

        var act = async () => await useCase.Execute(request);

        var result = await act.Should().ThrowAsync<ErrorOnValidationException>();

        result.Where(e => e.GetErrors().Count.Equals(1) && e.GetErrors().Contains(ResourceErrorMessages.PASSWORD_DOES_NOT_MATCH));
    }

    private ChangePasswordUseCase CreateUseCase(User user, string? password = null)
    {
        var repository = UsersUpdateOnlyRepositoryBuilder.Build(user);
        var loggedUser = LoggedUserBuilder.Build(user);
        var passwordEncryptor = new PasswordEncryptorBuilder().Verify(password).Build();
        var unitOfWork = UnitOfWorkBuilder.Build();

        return new ChangePasswordUseCase(repository, loggedUser, passwordEncryptor, unitOfWork);
    }
}
