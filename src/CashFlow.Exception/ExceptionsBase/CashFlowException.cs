using System.Net;

namespace CashFlow.Exception.ExceptionsBase;
public abstract class CashFlowException : SystemException
{
    protected CashFlowException(string message) : base(message)
    {
        
    }

    public abstract HttpStatusCode GetHttpStatusCode();
    public abstract List<string> GetErrors();
}
