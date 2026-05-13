using INKFLOW.Data;
using INKFLOW.DTOs;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddToCartAsync(int userId, int productId, int quantity)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem { UserId = userId, ProductId = productId, Quantity = quantity });
        }
        await _context.SaveChangesAsync();
    }

    public async Task<CartResponseDto> GetCartAsync(int userId)
    {
        var items = await _context.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .Select(c => new CartItemDto
            {
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                ImageUrl = c.Product.ImageUrl,
                Price = c.Product.Price,
                Quantity = c.Quantity
            }).ToListAsync();

        return new CartResponseDto { Items = items };
    }

    public async Task SetCartItemQuantityAsync(int userId, int productId, int quantity)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (existingItem == null) return;

        if (quantity <= 0)
            _context.CartItems.Remove(existingItem);
        else
            existingItem.Quantity = quantity;

        await _context.SaveChangesAsync();
    }
}