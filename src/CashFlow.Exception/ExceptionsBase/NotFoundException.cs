using System.Net;

namespace CashFlow.Exception.ExceptionsBase;
public class NotFoundException : CashFlowException
{
    public NotFoundException(string message) : base(message)
    {
        
    }
    public override List<string> GetErrors() => [Message];

    public override HttpStatusCode GetHttpStatusCode() => HttpStatusCode.NotFound;
}
