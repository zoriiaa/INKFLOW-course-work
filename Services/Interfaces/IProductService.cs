namespace INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;

public interface IProductService
{
    
    Task<IEnumerable<ProductCardDto>> GetCatalogAsync(int? categoryId, int? brandId, string? searchTerm,int pageNumber, int pageSize);
    
    Task<ProductDetailDto?> GetProductByIdAsync(int id);
}