using AutoMapper;
using CashFlow.Communication.Response;
using CashFlow.Domain.Services.LoggedUser;

namespace CashFlow.Application.UseCases.Users.Profile;
public class GetProfileUseCase : IGetProfileUseCase
{
    private readonly ILoggedUser _loggedUser;
    private readonly IMapper _mapper;

    public GetProfileUseCase(ILoggedUser loggedUser, IMapper mapper)
    {
        _loggedUser = loggedUser;
        _mapper = mapper;
    }

    public async Task<ResponseUserProfileUseCaseJson> Execute()
    {
        var loggedUser = await _loggedUser.Get();

        return _mapper.Map<ResponseUserProfileUseCaseJson>(loggedUser);
    }
}
