using CashFlow.Application.UseCases.Users.Profile;
using CashFlow.Domain.Entities;
using CommonTestsUtilities.Entities;
using CommonTestsUtilities.LoggedUser;
using CommonTestsUtilities.Mapper;
using FluentAssertions;

namespace UseCases.Test.Users.Profile;
public class GetProfileUseCaseTest
{

    [Fact]
    public async Task Success()
    {
        var user = UserBuilder.Build();
        var useCase = CreateUseCase(user);

        var result = await useCase.Execute();

        result.Should().NotBeNull();
        result.Name.Should().Be(user.Name);
        result.Email.Should().Be(user.Email);
    }

    private GetProfileUseCase CreateUseCase(User user)
    {
        var loggedUser = LoggedUserBuilder.Build(user);
        var mapper = MapperBuilder.Build();

        return new GetProfileUseCase(loggedUser, mapper);
    }
}
