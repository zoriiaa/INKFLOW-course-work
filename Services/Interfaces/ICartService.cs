namespace INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;

public interface ICartService
{
    Task<string?> AddToCartAsync(int userId, int productId, int quantity);
    Task<CartResponseDto> GetCartAsync(int userId);
    Task<string?> SetCartItemQuantityAsync(int userId, int productId, int quantity);
}
