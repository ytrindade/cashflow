using CashFlow.Domain.Repositories;
using CashFlow.Domain.Repositories.Expenses;
using CashFlow.Domain.Services.LoggedUser;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;

namespace CashFlow.Application.UseCases.Expenses.Delete;
public class DeleteExpenseUseCase : IDeleteExpenseUseCase
{
    private readonly IExpensesReadOnlyRepository _readRepository;
    private readonly IExpensesWriteOnlyRepository _writeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILoggedUser _loggedUser;

    public DeleteExpenseUseCase(
        IExpensesReadOnlyRepository readRepository,
        IExpensesWriteOnlyRepository writeRepository,
        IUnitOfWork unitOfWork, 
        ILoggedUser loggedUser)
    {
        _readRepository = readRepository;
        _writeRepository = writeRepository;
        _unitOfWork = unitOfWork;
        _loggedUser = loggedUser;
    }
    public async Task Execute(long id)
    {
        var loggedUser = await _loggedUser.Get();

        var expense = await _readRepository.GetById(loggedUser, id);

        if (expense is null)
            throw new NotFoundException(ResourceErrorMessages.EXPENSE_NOT_FOUND);

        await _writeRepository.Delete(id);

        await _unitOfWork.Commit();
    }
}
