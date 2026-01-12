using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories.Expenses;
using Moq;

namespace CommonTestsUtilities.Repositories.Expenses;
public class ExpensesReadOnlyRepositoryBuilder
{
    private readonly Mock<IExpensesReadOnlyRepository> _mock;

    public ExpensesReadOnlyRepositoryBuilder() => _mock = new Mock<IExpensesReadOnlyRepository>();

    public ExpensesReadOnlyRepositoryBuilder GetAll(User user, List<Expense> expenses)
    {
        _mock.Setup(config => config.GetAll(user)).ReturnsAsync(expenses);

        return this;
    }

    public ExpensesReadOnlyRepositoryBuilder GetById(User user, Expense? expense)
    {
        if (expense is not null)
            _mock.Setup(config => config.GetById(user, expense.Id)).ReturnsAsync(expense);

        return this;
    }

    public ExpensesReadOnlyRepositoryBuilder FilterByMonth(User user, List<Expense> expenses)
    {
        _mock.Setup(config => config.FilterByMonth(user, It.IsAny<DateOnly>())).ReturnsAsync(expenses);

        return this;
    }

    public IExpensesReadOnlyRepository Build() => _mock.Object;
}
