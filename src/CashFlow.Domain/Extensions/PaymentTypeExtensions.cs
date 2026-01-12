using CashFlow.Domain.Enums;
using CashFlow.Domain.Reports;

namespace CashFlow.Domain.Extensions;
public static class PaymentTypeExtensions
{
    public static string PaymentTypeToString(this PaymentType paymentType)
    {
        return paymentType switch
        {
            PaymentType.Cash => ResourceReportPaymentTypeMessages.CASH,
            PaymentType.CreditCard => ResourceReportPaymentTypeMessages.CREDIT_CARD,
            PaymentType.DebitCard => ResourceReportPaymentTypeMessages.DEBIT_CARD,
            PaymentType.EletronicTransfer => ResourceReportPaymentTypeMessages.ELETRONIC_TRANSFER,
            _ => string.Empty
        };
    }
}
