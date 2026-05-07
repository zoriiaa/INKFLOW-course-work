using INKFLOW.Models;
namespace INKFLOW.Services.Interfaces;

public interface IFavouriteService
{
    Task AddToFavouritesAsync(int userId, int productId);
    Task RemoveFromFavouritesAsync(int userId, int productId);
    Task<List<Product>> GetUserFavouritesAsync(int userId);
}