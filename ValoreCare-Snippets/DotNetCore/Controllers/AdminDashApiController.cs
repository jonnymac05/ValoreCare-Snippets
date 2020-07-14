using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.AdminDashboard;
using Sabio.Services;
using Sabio.Services.Admin_Dashboard;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/admindash")]
    [ApiController]
    public class AdminDashApiController : BaseApiController
    {
        private IAdminDashService _service = null;
        private IAuthenticationService<int> _authService = null;

        public AdminDashApiController(IAdminDashService service, ILogger<AdminDashApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("usertotals")]
        public ActionResult<ItemsResponse<TotalUsers>> GetTotalUsers()
        {
            int iCode = 200;
            BaseResponse response;
            try
            {
                TotalUsers users = _service.GetTotalUsers();
                if (users == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Error Not Found");
                }
                else
                {
                    response = new ItemResponse<TotalUsers> { Item = users };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("dashboard")]
        public ActionResult<ItemResponse<Dashboard>> GetDashboard()
        {
            int iCode = 200;
            BaseResponse response;
            try
            {
                Dashboard dashboard = _service.GetDashboard();
                if (dashboard == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Error Not Found");
                }
                else
                {
                    response = new ItemResponse<Dashboard> { Item = dashboard };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

    }

}