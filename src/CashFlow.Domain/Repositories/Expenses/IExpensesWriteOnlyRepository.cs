using CashFlow.Domain.Entities;

namespace CashFlow.Domain.Repositories.Expenses;
public interface IExpensesWriteOnlyRepository
{
    Task Add(Expense expense);
    /// <summary>
    /// This function returns FALSE if the request was Successful
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task Delete(long id);
}
