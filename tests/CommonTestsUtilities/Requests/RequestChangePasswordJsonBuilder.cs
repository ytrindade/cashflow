using Bogus;
using CashFlow.Communication.Requests;

namespace CommonTestsUtilities.Requests;
public static class RequestChangePasswordJsonBuilder
{
    public static RequestChangePasswordJson Build()
    {
        return new Faker<RequestChangePasswordJson>()
            .RuleFor(r => r.CurrentPassword, f => f.Internet.Password())
            .RuleFor(r => r.NewPassword, f => f.Internet.Password(prefix: "Aa1!"));
    }
}
