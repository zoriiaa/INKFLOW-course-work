using AutoMapper;
using INKFLOW.Models;
using INKFLOW.DTOs;


namespace INKFLOW.Mappings;


public class MappingProfile: Profile
{
    public MappingProfile()
    {
        
        CreateMap<Product, ProductCardDto>()
            .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : null))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

        
        CreateMap<Product, ProductDetailDto>()
            .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : null))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

        CreateMap<ProductCreateDto, Product>();

        CreateMap<Order, OrderResponseDto>();
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt
            .MapFrom(src => src.Product.Name));
    }
}