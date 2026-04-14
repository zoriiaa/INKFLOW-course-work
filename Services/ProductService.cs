using AutoMapper;
using INKFLOW.Data;
using INKFLOW.DTOs;
using INKFLOW.Models;
using INKFLOW.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace INKFLOW.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper; 

    public ProductService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductCardDto>> GetCatalogAsync(int? categoryId, int? brandId, string? searchTerm)
    {
        var query = _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .AsQueryable();

        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId);
        if (brandId.HasValue) query = query.Where(p => p.BrandId == brandId);
        if (!string.IsNullOrEmpty(searchTerm)) query = query.Where(p => p.Name.ToLower().Contains(searchTerm.ToLower()));
        

        var products = await query.ToListAsync();

        
        return _mapper.Map<IEnumerable<ProductCardDto>>(products);
    }
    

    public async Task<ProductDetailDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        return _mapper.Map<ProductDetailDto>(product);
    }
    
    

   
}
