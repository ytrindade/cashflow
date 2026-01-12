using CashFlow.Application.UseCases.Users.Delete;
using CashFlow.Domain.Entities;
using CommonTestsUtilities.Entities;
using CommonTestsUtilities.LoggedUser;
using CommonTestsUtilities.Repositories;
using CommonTestsUtilities.Repositories.Users;
using FluentAssertions;

namespace UseCases.Test.Users.Delete;
public class DeleteUserUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var loggedUser = UserBuilder.Build();
        var useCase = CreateUseCase(loggedUser);

        var act = async () => await useCase.Execute();

        await act.Should().NotThrowAsync();
    }

    private DeleteUserUseCase CreateUseCase(User user)
    {
        var loggedUser = LoggedUserBuilder.Build(user);
        var repository = UsersWriteOnlyRepositoryBuilder.Build();
        var unitOfWork = UnitOfWorkBuilder.Build();

        return new DeleteUserUseCase(loggedUser, repository, unitOfWork);

    }
}
