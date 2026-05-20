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
}