using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class CommentService : ICommentService
    {
        
        IDataProvider _data = null;

        public CommentService(IDataProvider data)
        {
            _data = data;
        }

        public int Insert(CommentAddRequest model, int UserId)
        {
            int id = 0;
            string procName = "[dbo].[Comments_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                SqlCollection(model, col, UserId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        private static void SqlCollection(CommentAddRequest model, SqlParameterCollection col, int UserId)
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@CreatedBy", UserId);
            col.AddWithValue("@isDeleted", model.IsDeleted);
        }

        public void Update(CommentUpdateRequest model, int UserId)
        {
            string procName = "[dbo].[Comments_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", model.Id);
                SqlCollection(model, col, UserId);

            },
            returnParameters: null);
        }

        public Paged<Comment> Paginate(int pageIndex, int pageSize)
        {
            Paged<Comment> pagedResult = null;

            List<Comment> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[Comments_SelectAll_V2]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@pageIndex", pageIndex);
                    parameterCollection.AddWithValue("@pageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Comment comment = new Comment();
                    int index = CommentMapper(reader, comment);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<Comment>();
                    }

                    result.Add(comment);
                }

            );
            if (result != null)
            {
                pagedResult = new Paged<Comment>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        private static int CommentMapper(IDataReader reader, Comment comment)
        {
            int index = 0;
            
            comment.Id = reader.GetSafeInt32(index++);
            comment.Subject = reader.GetSafeString(index++);
            comment.Text = reader.GetSafeString(index++);
            comment.ParentId = reader.GetSafeInt32Nullable(index++);
            comment.EntityTypeId = reader.GetSafeInt32(index++);
            comment.EntityId = reader.GetSafeInt32(index++);
            comment.DateCreated = reader.GetSafeDateTime(index++);
            comment.DateModified = reader.GetSafeDateTime(index++);
            comment.IsDeleted = reader.GetSafeBool(index++);
            comment.FirstName = reader.GetSafeString(index++);
            comment.LastName = reader.GetSafeString(index++);
            comment.AvatarUrl = reader.GetSafeString(index++);
            comment.CreatedBy = reader.GetSafeInt32(index++);
            return index;
        }

        public Paged<Comment> SelectByCreatedBy(int pageIndex, int pageSize, int UserId)
        {

            

            Paged<Comment> pagedResult = null;

            List<Comment> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[Comments_Select_ByCreatedBy_V2]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@CreatedBy", UserId);
                    parameterCollection.AddWithValue("@pageIndex", pageIndex);
                    parameterCollection.AddWithValue("@pageSize", pageSize);                  
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Comment comment = new Comment();
                    int index = CommentMapper(reader, comment);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<Comment>();
                    }

                    result.Add(comment);
                }

            );
            if (result != null)
            {
                pagedResult = new Paged<Comment>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public List<Comment> SelectByEntityId(int entityId, int entityTypeId)
        {
            
            List<Comment> list = null;

            string procName = "[dbo].[Comments_Select_ByEntityId_V2]";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramsCollection)
            {
                paramsCollection.AddWithValue("@EntityId", entityId);
                paramsCollection.AddWithValue("@EntityTypeId", entityTypeId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                Comment comment = new Comment();
                int index = CommentMapper(reader, comment);

                if (list == null)
                {
                    list = new List<Comment>();
                }

                list.Add(comment);
            }
           );

            return list;
        }
        public Comment GetById(int id)
        {

            Comment comment = null;

            string procName = "[dbo].[Comments_SelectById_V2]";
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramsCollection)
            {
                paramsCollection.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                comment = new Comment();
                int index = CommentMapper(reader, comment);

            }
           );


            return comment;
        }

        public void Delete(int id)
        {
            
            string procName = "[dbo].[Comments_Delete_V2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);

            },
            returnParameters: null);
        }
    }

}
