using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface ICommentService
    {
        void Delete(int id);
        Comment GetById(int id);
        int Insert(CommentAddRequest model, int userId);
        Paged<Comment> Paginate(int pageIndex, int pageSize);
        public Paged<Comment> SelectByCreatedBy(int pageIndex, int pageSize, int userId);
        public List<Comment> SelectByEntityId(int entityId, int entityTypeId);
        void Update(CommentUpdateRequest model, int userId);
    }
}