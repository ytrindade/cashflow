using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories.Users;
using Moq;

namespace CommonTestsUtilities.Repositories.Users;
public static class UsersUpdateOnlyRepositoryBuilder
{
    public static IUsersUpdateOnlyRepository Build(User user)
    {
        var mock = new Mock<IUsersUpdateOnlyRepository>();

        mock.Setup(config => config.GetById(user.Id)).ReturnsAsync(user);

        return mock.Object;
    }
}
