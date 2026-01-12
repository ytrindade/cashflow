using System.Net;

namespace CashFlow.Exception.ExceptionsBase;
public class InvalidLoginException : CashFlowException
{

    public InvalidLoginException() : base(ResourceErrorMessages.EMAIL_OR_PASSWWORD_INVALID)
    {
        
    }
    public override List<string> GetErrors() => [Message];
    
    public override HttpStatusCode GetHttpStatusCode() => HttpStatusCode.Unauthorized;
}
