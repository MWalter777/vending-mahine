using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Machine.Startup))]
namespace Machine
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
