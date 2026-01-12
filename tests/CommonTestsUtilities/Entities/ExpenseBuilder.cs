using Bogus;
using CashFlow.Domain.Enums;
using CashFlow.Domain.Entities;

namespace CommonTestsUtilities.Entities;
public static class ExpenseBuilder
{
    public static List<Expense> Collection(User user, uint count = 2)
    {
        var expenses = new List<Expense>();

        if(count == 0)
            count = 1;

        var expenseId = 1;

        for(int  i = 0; i < count; i++)
        {
            var expense = Build(user);
            expense.Id = expenseId++;

            expenses.Add(expense);
        }

        return expenses;
    }
    public static Expense Build(User user)
    {
        return new Faker<Expense>()
            .RuleFor(e => e.Id, _ => 1)
            .RuleFor(r => r.Title, f => f.Commerce.ProductName())
            .RuleFor(r => r.Description, f => f.Commerce.ProductDescription())
            .RuleFor(r => r.Date, f => f.Date.Past())
            .RuleFor(r => r.PaymentType, f => f.PickRandom<PaymentType>())
            .RuleFor(r => r.Amount, faker => faker.Random.Decimal(min: 1, max: 1000))
            .RuleFor(r => r.UserId, _ => user.Id)
            .RuleFor(r => r.Tags, faker => faker.Make(1, () => new CashFlow.Domain.Entities.Tag
            {
                Id = 1,
                Value = faker.PickRandom<CashFlow.Domain.Enums.Tag>(),
                ExpenseId = 1
            }));
    }
}
