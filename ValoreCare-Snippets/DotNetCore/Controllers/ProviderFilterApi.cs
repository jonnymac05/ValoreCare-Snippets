using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.ProviderFilter;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers.Temp
{
    [Route("api/providerfilter")]
    [ApiController]
    public class ProviderFiltersApiController : BaseApiController
    {
        private IProviderFilterService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ProviderFiltersApiController(IProviderFilterService service
        , ILogger<ProviderFiltersApiController> logger
        , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<ProviderFilter>>> QueryProviders(int pageIndex, int pageSize, float latitude, float longitude, string json, int radius)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<ProviderFilter> list = _service.QueryProviders(pageIndex, pageSize, latitude, longitude, json, radius);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<ProviderFilter>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ProviderDetails>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ProviderDetails details = _service.SelectByProviderId(id);

                if (details == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Schedule not found");
                }
                else
                {
                    response = new ItemResponse<ProviderDetails> { Item = details };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: ${ ex.Message}");
            }
            return StatusCode(iCode, response);
        }


    }
}
