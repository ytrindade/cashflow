using CashFlow.Communication.Requests;
using CashFlow.Exception;
using CommonTestsUtilities.Requests;
using FluentAssertions;
using System.Globalization;
using System.Net;
using System.Text.Json;
using WebApi.Test.InlineData;

namespace WebApi.Test.Users.ChangePassword;
public class ChangePasswordTest : CashFlowClassFixture
{
    private const string METHOD = "api/User/change-password";

    private readonly string _token;
    private readonly string _email;
    private readonly string _password;
    public ChangePasswordTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
        _token = webApplicationFactory.User_Team_Member.GetToken();
        _email = webApplicationFactory.User_Team_Member.GetEmail();
        _password = webApplicationFactory.User_Team_Member.GetPassword();
    }

    [Fact]
    public async Task Success()
    {
        var request = RequestChangePasswordJsonBuilder.Build();
        request.CurrentPassword = _password;

        var result = await DoPut(METHOD, request, _token);
        result.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var loginRequest = new RequestLoginJson
        {
            Email = _email,
            Password = _password
        };

        result = await DoPost("api/Login", loginRequest);
        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);


        loginRequest.Password = request.NewPassword;

        result = await DoPost("api/Login", loginRequest);
        result.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Password_Does_Not_Match(string culture)
    {
        var request = RequestChangePasswordJsonBuilder.Build();

        var result = await DoPut(METHOD, request, _token);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        var expectedMessage = ResourceErrorMessages.ResourceManager.GetString("PASSWORD_DOES_NOT_MATCH", new CultureInfo(culture));

        var errors = response.RootElement.GetProperty("errorMessages").EnumerateArray();

        errors.Should().ContainSingle().And.Contain(e => e.GetString()!.Equals(expectedMessage));
    }
}
