using CashFlow.Application.UseCases.Users.Update;
using CashFlow.Domain.Entities;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using CommonTestsUtilities.Entities;
using CommonTestsUtilities.LoggedUser;
using CommonTestsUtilities.Mapper;
using CommonTestsUtilities.Repositories;
using CommonTestsUtilities.Repositories.Users;
using CommonTestsUtilities.Requests;
using FluentAssertions;

namespace UseCases.Test.Users.Update;
public class UpdateUserUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserJsonBuilder.Build();

        var useCase = CreateUseCase(user);

        var act = async () => await useCase.Execute(request);

        await act.Should().NotThrowAsync();

        user.Name.Should().Be(request.Name);
        user.Email.Should().Be(request.Email);
    }

    [Fact]
    public async Task Error_Name_Empty()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserJsonBuilder.Build();
        request.Name = string.Empty;

        var useCase = CreateUseCase(user);

        var act = async () => await useCase.Execute(request);

        var result = await act.Should().ThrowAsync<ErrorOnValidationException>();

        result.Where(ex => ex.GetErrors().Count.Equals(1) && ex.GetErrors().Contains(ResourceErrorMessages.NAME_EMPTY));
    }

    [Fact]
    public async Task Error_Email_Already_Exists()
    {
        var user = UserBuilder.Build();
        var request = RequestUpdateUserJsonBuilder.Build();

        var useCase = CreateUseCase(user, request.Email);

        var act = async () => await useCase.Execute(request);

        var result = await act.Should().ThrowAsync<ErrorOnValidationException>();

        result.Where(ex => ex.GetErrors().Count.Equals(1) && ex.GetErrors().Contains(ResourceErrorMessages.EMAIL_ALREADY_EXISTS));
    }

    private UpdateUserUseCase CreateUseCase(User user, string? email = null)
    {
        var readRepository = new UsersReadOnlyRepositoryBuilder();
        var updateRepository = UsersUpdateOnlyRepositoryBuilder.Build(user);
        var loggedUser = LoggedUserBuilder.Build(user);
        var mapper = MapperBuilder.Build();
        var unitOfWork = UnitOfWorkBuilder.Build();

        if (!string.IsNullOrEmpty(email))
            readRepository.ExistActiveUserWithEmail(email);

        return new UpdateUserUseCase(readRepository.Build(), updateRepository, loggedUser, mapper, unitOfWork);
    }
}
