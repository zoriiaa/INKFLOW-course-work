namespace INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;

public interface ICartService
{
    Task AddToCartAsync(int userId, int productId, int quantity);
    Task<CartResponseDto> GetCartAsync(int userId);
}