using CashFlow.Communication.Requests;
using CashFlow.Exception;
using CommonTestsUtilities.Requests;
using FluentAssertions;
using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using WebApi.Test.InlineData;


namespace WebApi.Test.Login.DoLogin;
public class DoLoginTest : CashFlowClassFixture
{

    public const string METHOD = "api/Login";
    private readonly string _name;
    private readonly string _email;
    private readonly string _password;

    public DoLoginTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
        _name = webApplicationFactory.User_Team_Member.GetName();
        _email = webApplicationFactory.User_Team_Member.GetEmail();
        _password = webApplicationFactory.User_Team_Member.GetPassword();
    }

    [Fact]
    public async Task Success()
    {
        var request = new RequestLoginJson
        {
            Email = _email,
            Password = _password
        };

        var response = await DoPost(METHOD, request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var responseBody = await response.Content.ReadAsStreamAsync();

        var responseData = await JsonDocument.ParseAsync(responseBody);

        responseData.RootElement.GetProperty("name").GetString().Should().Be(_name);
        responseData.RootElement.GetProperty("token").GetString().Should().NotBeNullOrWhiteSpace();

    }

    [Theory]
    [ClassData(typeof(CultureInlineDataTest))]
    public async Task Error_Invalid_Login(string culture)
    {
        var request = RequestLoginJsonBuilder.Build();

        var result = await DoPost(METHOD, request, culture: culture);

        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        var errors = response.RootElement.GetProperty("errorMessages").EnumerateArray();

        var expectedMessage = ResourceErrorMessages.ResourceManager.GetString("EMAIL_OR_PASSWWORD_INVALID", new CultureInfo(culture));

        errors.Should().HaveCount(1).And.Contain(ex => ex.GetString()!.Equals(expectedMessage));
    }
}
