using CashFlow.Application.UseCases.Users.SharedValidator;
using CashFlow.Communication.Requests;
using CashFlow.Communication.Response;
using CashFlow.Domain.Repositories.Users;
using CashFlow.Domain.Security.Cryptography;
using CashFlow.Domain.Security.Token;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using FluentValidation.Results;

namespace CashFlow.Application.UseCases.Users.Login;
public class DoLoginUseCase : IDoLoginUseCase
{
    private readonly IUsersReadOnlyRepository _usersReadOnlyRepository;
    private readonly IPasswordEncryptor _passwordEncryptor;
    private readonly IAccessTokenGenerator _accessTokenGenerator;

    public DoLoginUseCase(
        IUsersReadOnlyRepository usersReadOnlyRepository, 
        IPasswordEncryptor passwordEncryptor, 
        IAccessTokenGenerator accessTokenGenerator)
    {
        _usersReadOnlyRepository = usersReadOnlyRepository;
        _passwordEncryptor = passwordEncryptor;
        _accessTokenGenerator = accessTokenGenerator;
    }

    public async Task<ResponseRegisteredUserJson> Execute(RequestLoginJson request)
    {
        //Validate(request);

        var user = await _usersReadOnlyRepository.GetUserByEmail(request.Email);

        if (user is null)
            throw new InvalidLoginException();

        var passwordMatch = _passwordEncryptor.Verify(request.Password, user.Password);

        if(!passwordMatch)
            throw new InvalidLoginException();


        return new ResponseRegisteredUserJson
        {
            Name = user.Name,
            Token = _accessTokenGenerator.Generate(user)
        };
    }


    private void Validate(RequestLoginJson request)
    {
        var result = new LoginValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(failure => failure.ErrorMessage).ToList();

            throw new ErrorOnValidationException(errors);
        }
    }
}
