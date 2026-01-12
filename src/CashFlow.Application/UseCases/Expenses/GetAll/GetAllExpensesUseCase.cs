using AutoMapper;
using CashFlow.Communication.Response;
using CashFlow.Domain.Repositories.Expenses;
using CashFlow.Domain.Services.LoggedUser;

namespace CashFlow.Application.UseCases.Expenses.GetAll;
public class GetAllExpensesUseCase : IGetAllExpensesUseCase
{
    private IExpensesReadOnlyRepository _repository;
    private IMapper _mapper;
    private readonly ILoggedUser _loggedUser;

    public GetAllExpensesUseCase(IExpensesReadOnlyRepository repository, IMapper mapper, ILoggedUser loggedUser)
    {
        _repository = repository;
        _mapper = mapper;
        _loggedUser = loggedUser;
    }

    public async Task<ResponseExpensesJson> Execute()
    {
        var loggedUser = await _loggedUser.Get();

        var expenses = await _repository.GetAll(loggedUser);

        return new ResponseExpensesJson
        {
            Expenses = _mapper.Map<List<ResponseShortExpenseJson>>(expenses)
        };
    }

}
