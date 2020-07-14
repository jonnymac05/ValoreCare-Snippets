using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Appointments;
using Sabio.Models.Requests.ScheduleAvailbility;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentApiController : BaseApiController
    {
        private IEmailService _emailService = null;
        private IAppointmentService _service = null;
        private IAuthenticationService<int> _authService = null;

        public AppointmentApiController(IAppointmentService service
            , ILogger<AppointmentApiController> logger
            , IAuthenticationService<int> authService
            , IEmailService emailService) : base(logger)

        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpGet("providers")]
        public ActionResult<ItemsResponse<Appointment>> SelectBySeekerId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int seekerId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectBySeekerId(seekerId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }

        [HttpGet("seeker")]
        public ActionResult<ItemsResponse<Appointment>> SelectBySeekerAndProviderId(int seekerId, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                if (userId == seekerId)
                {
                    code = 404;
                    response = new ErrorResponse("No Resource found");
                }
                else
                {
                    Paged<Appointment> paged = _service.SelectBySeekerAndProviderId(seekerId, userId, pageIndex, pageSize);

                    if (paged == null)
                    {
                        code = 404;
                        response = new ErrorResponse("App Resource not found.");
                    }
                    else
                    {
                        response = new ItemResponse<Paged<Appointment>> { Item = paged };
                    }
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }
        [HttpGet("current/confirmed")]
        public ActionResult<ItemsResponse<Appointment>> SelectByConfirmedByProviderId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectByConfirmedByProviderId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("There are no appointments confirmed.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }
        [HttpGet("current/notconfirmed")]
        public ActionResult<ItemsResponse<Appointment>> SelectByNotConfirmedByProviderId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectByNotConfirmedByProviderId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }
        [HttpGet("current")]
        public ActionResult<ItemsResponse<Appointment>> SelectByProviderId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectByProviderId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("There are no appointments.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }
        [HttpGet("current/seeker")]
        public ActionResult<ItemsResponse<Appointment>> SelectSeekerAppointments(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectValidAppointmentsBySeekerId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("There are no appointments.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }

        [HttpGet("seekerProviderLog")]
        public ActionResult<ItemsResponse<Appointment>> SelectProviderBySeekerId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paged = _service.SelectProviderBySeekerId(userId, pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }

        [HttpGet("paginate")]
        public ActionResult<ItemsResponse<Appointment>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                Paged<Appointment> paged = _service.Paginate(pageIndex, pageSize);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Server Error: {ex.Message}");
            }


            return StatusCode(code, response);

        }
        #region GetById
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Appointment>> GetById(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Appointment appointment = _service.Get(id);

                if (appointment == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");
                }
                else

                    response = new ItemResponse<Appointment> { Item = appointment };
            }
            catch (Exception ex)
            {

                iCode = 500;
                response = new ErrorResponse($"Server Error: {ex.Message}");
                base.Logger.LogError(ex.Message.ToString());
            }

            return StatusCode(iCode, response);
        }

        #endregion

        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Create(AppointmentAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;

        }
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(AppointmentUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;


            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                Appointment appointmentWithEmail = _service.GetAppointmentForEmail(model.Id);
                _emailService.ConfirmAppointmentEmail(appointmentWithEmail);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
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

            return StatusCode(code, response);
        }

        [HttpGet("availability")]
        public ActionResult<ItemResponse<ScheduleAvailablityByDate>> GetAvailability(int userId, DateTime scheduleDate)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ScheduleAvailablityByDate availablity = _service.GetAvailability(userId, scheduleDate);

                if (availablity == null)
                {
                    code = 404;
                    response = new ErrorResponse("No Availability found");
                }
                else
                {
                    response = new ItemResponse<ScheduleAvailablityByDate> { Item = availablity };

                }

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPost("email")]
        public ActionResult<SuccessResponse> Create(AppointUpdateInfo model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                model.To = _service.GetEmail(model.SenderId);
                model.From = _service.GetEmail(_authService.GetCurrentUserId());
                _emailService.AppointmentQuestion(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);

        }



    }


}