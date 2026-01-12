using CashFlow.Communication.Requests;
using FluentValidation;

namespace CashFlow.Application.UseCases.Users.SharedValidator;
public class ChangePasswordValidator : AbstractValidator<RequestChangePasswordJson>
{
    public ChangePasswordValidator()
    {
        RuleFor(user => user.NewPassword).SetValidator(new PasswordValidator<RequestChangePasswordJson>());
    }
}
