using Bogus;
using CashFlow.Communication.Enums;
using CashFlow.Communication.Request;

namespace CommonTestsUtilities.Requests;
public class RequestExpenseJsonBuilder
{

    public static RequestExpenseJson Build()
    {
        return new Faker<RequestExpenseJson>()
            .RuleFor(r => r.Title, f => f.Commerce.ProductName())
            .RuleFor(r => r.Description, f => f.Commerce.ProductDescription())
            .RuleFor(r => r.Date, f => f.Date.Past())
            .RuleFor(r => r.PaymentType, faker => faker.PickRandom<PaymentType>())
            .RuleFor(r => r.Amount, faker => faker.Random.Decimal(min: 1, max: 1000))
            .RuleFor(r => r.Tags, faker => faker.Make(1, () => faker.PickRandom<Tag>()));
    }
}
