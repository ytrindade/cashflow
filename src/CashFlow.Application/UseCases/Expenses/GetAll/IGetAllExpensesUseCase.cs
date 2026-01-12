using CashFlow.Communication.Response;

namespace CashFlow.Application.UseCases.Expenses.GetAll;
public interface IGetAllExpensesUseCase
{
    Task<ResponseExpensesJson> Execute();
}
