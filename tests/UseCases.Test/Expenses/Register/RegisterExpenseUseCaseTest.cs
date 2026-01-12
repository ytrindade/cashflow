using CashFlow.Application.UseCases.Expenses.Register;
using CashFlow.Domain.Entities;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using CommonTestsUtilities.Entities;
using CommonTestsUtilities.LoggedUser;
using CommonTestsUtilities.Mapper;
using CommonTestsUtilities.Repositories;
using CommonTestsUtilities.Repositories.Expenses;
using CommonTestsUtilities.Requests;
using FluentAssertions;

namespace UseCases.Test.Expenses.Register;
public class RegisterExpenseUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var request = RequestExpenseJsonBuilder.Build();
        var loggedUser = UserBuilder.Build();
        var useCase = CreateUseCase(loggedUser);

        var result = await useCase.Execute(request);

        result.Should().NotBeNull();
        result.Title.Should().Be(request.Title);
    }

    [Fact]
    public async Task Error_Empty_Title()
    {
        var request = RequestExpenseJsonBuilder.Build();
        request.Title = string.Empty;
        var loggedUser = UserBuilder.Build();
        var useCase = CreateUseCase(loggedUser);

        var act = async () => await useCase.Execute(request);

        var result = await act.Should().ThrowAsync<ErrorOnValidationException>();

        result.Where(e => e.GetErrors().Count == 1 && e.GetErrors().Contains(ResourceErrorMessages.TITLE_REQUIRED));
    }

    private RegisterExpenseUseCase CreateUseCase(User user)
    {
        var writeRepository = ExpensesWriteOnlyRepositoryBuilder.Build();
        var unitOfWork = UnitOfWorkBuilder.Build();
        var mapper = MapperBuilder.Build();
        var loggedUser = LoggedUserBuilder.Build(user);

        return new RegisterExpenseUseCase(writeRepository, unitOfWork, mapper, loggedUser);
    }
}
