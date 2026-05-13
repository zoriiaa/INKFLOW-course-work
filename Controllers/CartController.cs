using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();
        
        await _cartService.AddToCartAsync(userId.Value, productId, quantity);
        return Ok(new{message = "Товар додано в кошик"});
    }
    
    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var userId = User.GetUserId();
        if(userId == null) return Unauthorized();
        
        var response = await _cartService.GetCartAsync(userId.Value);
        return Ok(response);
    }

    [HttpPut("quantity")]
    public async Task<IActionResult> SetQuantity(int productId, int quantity)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized();

        await _cartService.SetCartItemQuantityAsync(userId.Value, productId, quantity);
        return Ok(new { message = "Кошик оновлено" });
    }
    
}

