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

    public async Task<string?> AddToCartAsync(int userId, int productId, int quantity)
    {
        if (quantity <= 0) return "Кількість має бути більшою за нуль.";

        var product = await _context.Products.FindAsync(productId);
        if (product == null) return "Товар не знайдено.";

        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        var currentQuantity = existingItem?.Quantity ?? 0;
        if (quantity > product.Stock - currentQuantity)
            return "Запитана кількість перевищує залишок товару на складі.";

        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            _context.CartItems.Add(new CartItem { UserId = userId, ProductId = productId, Quantity = quantity });
        }
        await _context.SaveChangesAsync();
        return null;
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

    public async Task<string?> SetCartItemQuantityAsync(int userId, int productId, int quantity)
    {
        var existingItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (existingItem == null) return null;

        if (quantity <= 0)
            _context.CartItems.Remove(existingItem);
        else
        {
            var stock = await _context.Products
                .Where(product => product.Id == productId)
                .Select(product => (int?)product.Stock)
                .FirstOrDefaultAsync();
            if (stock == null) return "Товар не знайдено.";
            if (quantity > stock.Value)
                return "Запитана кількість перевищує залишок товару на складі.";

            existingItem.Quantity = quantity;
        }

        await _context.SaveChangesAsync();
        return null;
    }
}
