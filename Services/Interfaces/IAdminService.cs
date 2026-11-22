using INKFLOW.DTOs;
using INKFLOW.Models;

namespace INKFLOW.Services.Interfaces;

public interface IAdminService
{
    Task<List<object>> GetAllUsersAsync();
    Task<bool> ChangeRoleAsync(int id, ChangeRoleDto dto);
    Task<bool> DeleteUserAsync(int id);
    Task<List<Order>> GetAllOrdersAsync();
    Task<bool> ChangeOrderStatusAsync(int id, ChangeOrderStatusDto dto);
    Task<bool> DeleteOrderAsync(int id);
    Task<List<MonthlyRevenueDto>> GetMonthlyRevenueAsync();
    Task<List<TopProductSalesDto>> GetTopProductsAsync();
    Task<List<OrdersByStatusDto>> GetOrdersByStatusAsync();
}