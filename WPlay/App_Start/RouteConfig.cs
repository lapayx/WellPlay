using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WPlay
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "AllMounts",
                url: "api/GetAllMount",
                defaults: new { controller = "Radio", action = "GetAllMount", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "GetCurrentTrack",
                url: "api/GetCurrentTrack",
                defaults: new { controller = "Radio", action = "GetCurrentTrack", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}