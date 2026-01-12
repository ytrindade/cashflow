using Bogus;
using CashFlow.Domain.Entities;
using CashFlow.Domain.Enums;
using CommonTestsUtilities.Cryptography;

namespace CommonTestsUtilities.Entities;
public class UserBuilder
{
    public static User Build(string role = Roles.TEAM_MEMBER)
    {
        var passwordEncrtypter = new PasswordEncryptorBuilder().Build();

        var user = new Faker<User>()
            .RuleFor(user => user.Id, _ => 1)
            .RuleFor(user => user.Name, faker => faker.Person.FirstName)
            .RuleFor(user => user.Email, (faker, user) => faker.Internet.Email(user.Email))
            .RuleFor(user => user.Password, (_, user) => passwordEncrtypter.Encrypt(user.Password))
            .RuleFor(user => user.UserIdentifier, _ => Guid.NewGuid())
            .RuleFor(user => user.Role, _ => role);

        return user;
    }
}
