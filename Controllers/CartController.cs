using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using INKFLOW.Models;
using System.Security.Claims;
using INKFLOW.Data;
using INKFLOW.DTOs;

namespace INKFLOW.Controllers;

[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(int productId, int quantity = 1)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
        
        int userId = int.Parse(userIdStr);
        
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c=> c.UserId == userId && c.ProductId == productId);
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = productId,
                Quantity = quantity
            };
            _context.CartItems.Add(cartItem);
        }
        
        await _context.SaveChangesAsync();
        return Ok(new{message = "Товар додано в кошик"});
    }
    
    [HttpGet]
    public async Task<IActionResult> GetMyCart()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if(string.IsNullOrEmpty(userIdStr)) return Unauthorized();
        
        int userId = int.Parse(userIdStr);
        
        var cartItems = await _context.CartItems
            .Where(c=> c.UserId == userId)
            .Include(c=> c.Product)
            .Select(c=>new CartItemDto
            {
                ProductId = c.Product.Id,
                ProductName = c.Product.Name,
                Price = c.Product.Price,
                Quantity = c.Quantity
            })
            .ToListAsync();
        
        var response = new CartResponseDto
        {
            Items = cartItems
        };
        
        return Ok(response);
    }
    
}

