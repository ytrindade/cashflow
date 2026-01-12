using CashFlow.Communication.Requests;
using CashFlow.Exception;
using FluentValidation;

namespace CashFlow.Application.UseCases.Users.SharedValidator;
public class LoginValidator : AbstractValidator<RequestLoginJson>
{
    public LoginValidator()
    {
        RuleFor(user => user.Email).NotEmpty().WithMessage(ResourceErrorMessages.EMAIL_EMPTY)
            .EmailAddress().WithMessage(ResourceErrorMessages.EMAIL_INVALID);

        RuleFor(user => user.Password).SetValidator(new PasswordValidator<RequestLoginJson>());
    }
}
