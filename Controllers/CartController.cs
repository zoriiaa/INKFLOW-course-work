using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using INKFLOW.Services.Interfaces;

namespace INKFLOW.Controllers;

[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(int productId, int quantity = 1)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
        
        
        await _cartService.AddToCartAsync(int.Parse(userIdStr), productId, quantity);
        return Ok(new{message = "Товар додано в кошик"});
    }
    
    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if(string.IsNullOrEmpty(userIdStr)) return Unauthorized();
        
        var response = await _cartService.GetCartAsync(int.Parse(userIdStr));
        return Ok(response);
    }
    
}

