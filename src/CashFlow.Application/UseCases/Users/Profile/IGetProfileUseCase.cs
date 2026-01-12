using CashFlow.Communication.Response;

namespace CashFlow.Application.UseCases.Users.Profile;
public interface IGetProfileUseCase
{
    Task<ResponseUserProfileUseCaseJson> Execute();
}
