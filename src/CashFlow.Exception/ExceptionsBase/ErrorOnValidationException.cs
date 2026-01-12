using System.Net;

namespace CashFlow.Exception.ExceptionsBase;
public class ErrorOnValidationException : CashFlowException
{
    private readonly List<string> _errors;

    public ErrorOnValidationException(List<string> errors) : base(string.Empty)
    {
        _errors = errors;
    }

    public override HttpStatusCode GetHttpStatusCode() => HttpStatusCode.BadRequest;

    public override List<string> GetErrors() => _errors;
}
