using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentApiController : BaseApiController
    {
        private ICommentService _service = null;
        private IAuthenticationService<int> _authService = null;
        public CommentApiController(ICommentService service
            , ILogger<CommentApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("")]
        public ActionResult<ItemResponse<Paged<Comment>>> Paginate(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Comment> list = _service.Paginate(pageIndex, pageSize);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                    
                }
                else
                {
                    response = new ItemResponse<Paged<Comment>> { Item = list };
                    
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
        public ActionResult<ItemResponse<Comment>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Comment comment = _service.GetById(id);

                if (comment == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found");
                }
                else
                {
                    response = new ItemResponse<Comment> { Item = comment };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{entityTypeId:int}/{entityId:int}")]
        public ActionResult<ItemsResponse<Comment>> SelectByEntityId(int entityId, int entityTypeId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<Comment> list = _service.SelectByEntityId(entityId, entityTypeId);

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found");
                }
                else
                {
                    response = new ItemsResponse<Comment> { Items = list };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("createdby")]
        public ActionResult<ItemResponse<Paged<Comment>>> SelectByCreatedBy(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                Paged<Comment> list = _service.SelectByCreatedBy(pageIndex, pageSize, userId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<Comment>> { Item = list };
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

        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Insert(CommentAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Insert(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);


            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(CommentUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;//

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpPut("delete/{id:int}")]
        public ActionResult<ItemResponse<int>> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response); ;

        }
    }
}