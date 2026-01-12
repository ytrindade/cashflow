using AutoMapper;
using CashFlow.Application.UseCases.Users.SharedValidator;
using CashFlow.Communication.Requests;
using CashFlow.Domain.Repositories;
using CashFlow.Domain.Repositories.Users;
using CashFlow.Domain.Services.LoggedUser;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using FluentValidation.Results;

namespace CashFlow.Application.UseCases.Users.Update;
public class UpdateUserUseCase : IUpdateUserUseCase
{
    private readonly IUsersReadOnlyRepository _readRepository;
    private readonly IUsersUpdateOnlyRepository _updateRepository;
    private readonly ILoggedUser _loggedUser;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateUserUseCase(
        IUsersReadOnlyRepository readRepository, 
        IUsersUpdateOnlyRepository updateRepository, 
        ILoggedUser loggedUser, 
        IMapper mapper, 
        IUnitOfWork unitOfWork)
    {
        _readRepository = readRepository;
        _updateRepository = updateRepository;
        _loggedUser = loggedUser;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task Execute(RequestUpdateUserJson request)
    {
        var loggedUser = await _loggedUser.Get();

        await Validate(request, loggedUser.Email);

        var user = await _updateRepository.GetById(loggedUser.Id);

        _mapper.Map(request, user);

        _updateRepository.Update(user!);

        await _unitOfWork.Commit();
    }

    private async Task Validate(RequestUpdateUserJson request, string currentEmail)
    {
        var result = new UpdateUserValidator().Validate(request);

        if (!request.Email.Equals(currentEmail))
        {
            var userExist = await _readRepository.ExistActiveUserWithEmail(request.Email);

            if (userExist)
                result.Errors.Add(new ValidationFailure(string.Empty, ResourceErrorMessages.EMAIL_ALREADY_EXISTS));
        }

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(failure => failure.ErrorMessage).ToList();

            throw new ErrorOnValidationException(errors);
        }
    } 
}
