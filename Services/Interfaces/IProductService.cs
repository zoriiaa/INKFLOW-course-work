namespace INKFLOW.Services.Interfaces;
using INKFLOW.DTOs;

public interface IProductService
{
    
    Task<IEnumerable<ProductCardDto>> GetCatalogAsync(int? categoryId, int? brandId);
    Task<ProductDetailDto?> GetProductByIdAsync(int id);
}