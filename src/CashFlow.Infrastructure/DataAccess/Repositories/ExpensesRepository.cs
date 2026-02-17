using CashFlow.Domain.Entities;
using CashFlow.Domain.Repositories.Expenses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace CashFlow.Infrastructure.DataAccess.Repositories;
internal class ExpensesRepository : IExpensesReadOnlyRepository, IExpensesWriteOnlyRepository, IExpensesUpdateOnlyRepository
{
    private readonly CashFlowDbContext _dbContext;

    public ExpensesRepository(CashFlowDbContext dbContext) => _dbContext = dbContext;


    public async Task Add(Expense expense) => await _dbContext.Expenses.AddAsync(expense);

    public async Task<List<Expense>> GetAll(User user) => 
        await GetFullExpense()
        .AsNoTracking()
        .Where(expense => expense.UserId == user.Id)
        .ToListAsync();

    async Task<Expense?> IExpensesReadOnlyRepository.GetById(User user,long id) => 
        await GetFullExpense()
        .AsNoTracking()
        .FirstOrDefaultAsync(expense => expense.UserId == user.Id && expense.Id == id);

    async Task<Expense?> IExpensesUpdateOnlyRepository.GetById(User user, long id) =>
        await GetFullExpense().FirstOrDefaultAsync(expense => expense.Id == id && expense.UserId == user.Id);

    public async Task Delete(long id)
    {
        var expense = await _dbContext.Expenses.FindAsync(id);

        _dbContext.Expenses.Remove(expense!);
    }

    public void Update(Expense expense) => _dbContext.Expenses.Update(expense);

    public async Task<List<Expense>> FilterByMonth(User user, DateOnly date)
    {
        var daysInMonth = DateTime.DaysInMonth(date.Year, date.Month);

        var startDate = new DateTime(year: date.Year, month: date.Month, day: 1).Date;
        var endDate = new DateTime(year: date.Year, month: date.Month, day: daysInMonth, hour: 23, minute: 59, second: 59);

        return await _dbContext
            .Expenses
            .AsNoTracking()
            .Where(expense => expense.UserId.Equals(user.Id) && expense.Date >= startDate && expense.Date <= endDate)
            .OrderBy(expense => expense.Date)
            .ThenBy(expense => expense.Title)
            .ToListAsync();
    }

    public IIncludableQueryable<Expense, ICollection<Tag>> GetFullExpense() =>
        _dbContext.Expenses.Include(expense => expense.Tags);
    
}
