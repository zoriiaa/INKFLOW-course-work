using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace INKFLOW.Controllers;

public static class ControllerUserExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? user.FindFirstValue("nameid");

        return int.TryParse(value, out var userId) ? userId : null;
    }
}
