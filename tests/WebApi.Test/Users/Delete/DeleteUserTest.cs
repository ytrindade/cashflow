using CashFlow.Communication.Requests;
using FluentAssertions;
using System.Net;

namespace WebApi.Test.Users.Delete;
public class DeleteUserTest : CashFlowClassFixture
{
    private const string METHOD = "api/User";
    private readonly string _token;
    private readonly string _email;
    private readonly string _password;

    public DeleteUserTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
        _token = webApplicationFactory.User_Team_Member.GetToken();
        _email = webApplicationFactory.User_Team_Member.GetEmail();
        _password = webApplicationFactory.User_Team_Member.GetPassword();
    }

    [Fact]
    public async Task Success()
    {
        var result = await DoDelete(METHOD, _token);

        result.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var loginRequest = new RequestLoginJson
        {
            Email = _email,
            Password = _password
        };

        result = await DoPost("api/Login", loginRequest);

        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
