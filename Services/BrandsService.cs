using INKFLOW.Data;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class BrandsService : IBrandsService
{
    private readonly AppDbContext _context;

    public BrandsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Brand>> GetBrandsAsync()
    {
        return await _context.Brands.ToListAsync();
    }

    public async Task<Brand?> CreateBrandAsync(string name)
    {
        var normalizedName = name.Trim();
        if (string.IsNullOrEmpty(normalizedName)) return null;

        var exists = await _context.Brands
            .AnyAsync(brand => brand.Name.ToLower() == normalizedName.ToLower());
        if (exists) return null;

        var brand = new Brand { Name = normalizedName };
        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        return brand;
    }
}