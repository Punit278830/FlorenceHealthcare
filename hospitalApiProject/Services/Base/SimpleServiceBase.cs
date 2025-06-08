using System;
using hospitalApiProject.Services.Interfaces;

namespace hospitalApiProject.Services.Base
{
    public abstract class SimpleServiceBase : ISimpleServiceBase
    {
        public string ErrorMessage { get; set; }
    }
} 