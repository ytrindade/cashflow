using CashFlow.Communication.Request;
using CashFlow.Exception;
using FluentValidation;

namespace CashFlow.Application.UseCases.Expenses;
public class ExpenseValidator : AbstractValidator<RequestExpenseJson>
{
    public ExpenseValidator()
    {
        RuleFor(expense => expense.Title).NotEmpty().WithMessage(ResourceErrorMessages.TITLE_REQUIRED);
        RuleFor(expense => expense.Amount).GreaterThan(0).WithMessage(ResourceErrorMessages.AMOUNT_GREATER_THAN_ZERO);
        RuleFor(expense => expense.Date).LessThanOrEqualTo(DateTime.Now).WithMessage(ResourceErrorMessages.EXPENSES_FOR_PAST_DATES);
        RuleFor(expense => expense.PaymentType).IsInEnum().WithMessage(ResourceErrorMessages.PAYMENT_NOT_VALID);
        RuleFor(expense => expense.Tags).ForEach(tag =>
        {
            tag.IsInEnum().WithMessage(ResourceErrorMessages.TAG_TYPE_NOT_SUPPORTED);
        });
    }
}
