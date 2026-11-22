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

    public async Task<CatalogMutationResult> UpdateBrandAsync(int id, string name)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null) return CatalogMutationResult.NotFound;

        var normalizedName = name.Trim();
        if (string.IsNullOrEmpty(normalizedName)) return CatalogMutationResult.Invalid;

        var exists = await _context.Brands
            .AnyAsync(item => item.Id != id && item.Name.ToLower() == normalizedName.ToLower());
        if (exists) return CatalogMutationResult.Conflict;

        brand.Name = normalizedName;
        await _context.SaveChangesAsync();
        return CatalogMutationResult.Success;
    }

    public async Task<CatalogMutationResult> DeleteBrandAsync(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null) return CatalogMutationResult.NotFound;

        if (await _context.Products.AnyAsync(product => product.BrandId == id))
            return CatalogMutationResult.HasDependencies;

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();
        return CatalogMutationResult.Success;
    }
}