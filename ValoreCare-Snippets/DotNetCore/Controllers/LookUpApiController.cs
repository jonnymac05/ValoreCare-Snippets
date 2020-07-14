using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.AllLookUps;
using Sabio.Models.Domain.LookUp;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/lookup")]
    [ApiController]
    public class LookUpApiController : BaseApiController
    {
        private ILookUpService _service = null;
        private IAuthenticationService<int> _authService;

        public LookUpApiController(ILookUpService service,
            ILogger<LookUpApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet]
        public ActionResult<ItemResponse<AllLookUps>> GetAll()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                AllLookUps item = _service.GetAll();

                if (item == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resources Not Found");
                }
                else
                {
                    response = new ItemResponse<AllLookUps> { Item = item };
                }


            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("type")]
        public ActionResult<ItemsResponse<TwoColumn>> GetByTypeName(string type)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<TwoColumn> list = _service.GetByTypeName(type);

                if(list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resources Not Found");
                }
                else
                {
                    response = new ItemsResponse<TwoColumn> { Items = list };
                }

               
            }
            catch(Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("provider-types")]
        public ActionResult<ItemResponse<ProviderTypes>> GetProviderTypes()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ProviderTypes providerTypes = _service.GetProviderTypes();

                if (providerTypes == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Provider Types Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<ProviderTypes> { Item = providerTypes };
                }


            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemsResponse<TwoColumn>> SearchByTypeName(string type, string Query, int PageIndex, int PageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<TwoColumn> list = _service.SearchByTypeName(type, Query, PageIndex, PageSize);

                if(list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resources Not Found");
                }
                else
                {
                    response = new ItemsResponse<TwoColumn> { Items = list };
                }

               
            }
            catch(Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }
    }
}