using System;
using Microsoft.Data.SqlClient;
using System.Data;

namespace hospitalApiProject.Data
{
    public static class Parameters
    {
        public static SqlParameter[] Transform<T>(T i, string output)
        {
            List<SqlParameter> parameters = new();
            if (!object.Equals(i, default(T)))
            {
                var properties = i.GetType().GetProperties();
                for (int j = 0; j < properties.Length; j++)
                {
                    var property = properties[j];
                    if (property.GetValue(i) != null)
                    {
                        parameters.Add(new SqlParameter("@" + property.Name, property.GetValue(i)));
                    }
                }
            }
            if (!string.IsNullOrEmpty(output))
            {
                var outputParameter = new SqlParameter("@" + output, SqlDbType.Int);
                outputParameter.Direction = ParameterDirection.Output;
                parameters.Add(outputParameter);
            }
            return parameters.ToArray();
        }
    }
} 