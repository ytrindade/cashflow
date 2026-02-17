using CashFlow.Application.UseCases.Users.SharedValidator;
using CashFlow.Communication.Requests;
using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories;
using CashFlow.Domain.Repositories.Users;
using CashFlow.Domain.Security.Cryptography;
using CashFlow.Domain.Services.LoggedUser;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using FluentValidation.Results;

namespace CashFlow.Application.UseCases.Users.ChangePassword;
public class ChangePasswordUseCase : IChangePasswordUseCase
{
    private readonly IUsersUpdateOnlyRepository _repository;
    private readonly ILoggedUser _loggedUser;
    private readonly IPasswordEncryptor _passwordEncryptor;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordUseCase(
        IUsersUpdateOnlyRepository repository, 
        ILoggedUser loggedUser, 
        IPasswordEncryptor passwordEncryptor, 
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _loggedUser = loggedUser;
        _passwordEncryptor = passwordEncryptor;
        _unitOfWork = unitOfWork;
    }

    public async Task Execute(RequestChangePasswordJson request)
    {
        var loggedUser = await _loggedUser.Get();

        Validate(request, loggedUser);

        var user = await _repository.GetById(loggedUser.Id);
        user.Password = _passwordEncryptor.Encrypt(request.NewPassword);

        _repository.Update(user);

        await _unitOfWork.Commit();
    }

    private void Validate(RequestChangePasswordJson request, User loggedUser)
    {
        var result = new ChangePasswordValidator().Validate(request);

        var passwordMatch = _passwordEncryptor.Verify(request.CurrentPassword, loggedUser.Password);

        if(_passwordEncryptor.Verify(request.NewPassword, loggedUser.Password))
            result.Errors.Add(new ValidationFailure(string.Empty, ResourceErrorMessages.PASSWORD_MUST_BE_DIFFERENT));

        if (!passwordMatch)
            result.Errors.Add(new ValidationFailure(string.Empty, ResourceErrorMessages.PASSWORD_DOES_NOT_MATCH));

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(failure => failure.ErrorMessage).ToList();

            throw new ErrorOnValidationException(errors);
        }
    }
}
