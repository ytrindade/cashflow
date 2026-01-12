using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories.Expenses;
using Moq;

namespace CommonTestsUtilities.Repositories.Expenses;
public class ExpensesUpdateOnlyBuilder
{
    private readonly Mock<IExpensesUpdateOnlyRepository> _mock;

    public ExpensesUpdateOnlyBuilder() => _mock = new Mock<IExpensesUpdateOnlyRepository>();

    public ExpensesUpdateOnlyBuilder GetById(User user, Expense? expense)
    {
        if (expense is not null)
            _mock.Setup(config => config.GetById(user, expense.Id)).ReturnsAsync(expense);

        return this;
    }

    public IExpensesUpdateOnlyRepository Build() => _mock.Object;
}
