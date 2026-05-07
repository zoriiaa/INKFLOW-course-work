using INKFLOW.Data;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class FavouriteService : IFavouriteService
{
    private readonly AppDbContext _context;
    
    public  FavouriteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddToFavouritesAsync(int userId, int productId)
    {
        var exists = await _context.Favourites
            .AnyAsync(x => x.UserId == userId 
                           && x.ProductId == productId);

        if (!exists)
        {
            _context.Favourites.Add(new Favourite
            {
                UserId = userId,
                ProductId = productId
            });
            await _context.SaveChangesAsync();

        }
    }

    public async Task RemoveFromFavouritesAsync(int userId, int productId)
    {
        var fav = await _context.Favourites
            .FirstOrDefaultAsync(f => f.UserId == userId
            && f.ProductId == productId);

        if (fav != null)
        {
            _context.Favourites.Remove(fav);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Product>> GetUserFavouritesAsync(int userId)
    {
        return await  _context.Favourites
            .Where(f => f.UserId == userId)
            .Include(f => f.Product)
                .ThenInclude(p=>p.Brand)
            .Include(f => f.Product)
                .ThenInclude(p=> p.Category)
            .Select(f => f.Product)
            .ToListAsync();
    }
    
}