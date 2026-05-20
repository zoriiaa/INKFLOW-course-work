using INKFLOW.DTOs;
using INKFLOW.Models;

namespace INKFLOW.Services.Interfaces;

public interface IAdminService
{
    Task<List<object>> GetAllUsersAsync();
    Task<bool> ChangeRoleAsync(int id, ChangeRoleDto dto);
    Task<List<Order>> GetAllOrdersAsync();
    Task<bool> ChangeOrderStatusAsync(int id, ChangeOrderStatusDto dto);
}