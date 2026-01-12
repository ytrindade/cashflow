using CashFlow.Communication.Response;
using CashFlow.Exception;
using CashFlow.Exception.ExceptionsBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CashFlow.Api.Filters;

public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is CashFlowException exception)
        {
            context.HttpContext.Response.StatusCode = (int)exception.GetHttpStatusCode();

            context.Result = new ObjectResult(new ResponseErrorJson(exception.GetErrors()));
        }
        
       
    }   

    private void ThrowUnknownError(ExceptionContext context)
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

        context.Result = new ObjectResult(new ResponseErrorJson(ResourceErrorMessages.UNKNOWN_ERROR));
    }
}
