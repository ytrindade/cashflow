using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories.Users;
using Moq;

namespace CommonTestsUtilities.Repositories.Users;
public class UsersReadOnlyRepositoryBuilder
{
    private Mock<IUsersReadOnlyRepository> _repository;

    public UsersReadOnlyRepositoryBuilder()
    {
        _repository = new Mock<IUsersReadOnlyRepository>();
    }

    public void ExistActiveUserWithEmail(string email)
    {
        _repository.Setup(readRepository => readRepository.ExistActiveUserWithEmail(email)).ReturnsAsync(true);
    }

    public UsersReadOnlyRepositoryBuilder GetUserByEmail(User user)
    {
        _repository.Setup(readRepository => readRepository.GetUserByEmail(user.Email)).ReturnsAsync(user);

        return this;
    }

    public IUsersReadOnlyRepository Build() => _repository.Object;
}
