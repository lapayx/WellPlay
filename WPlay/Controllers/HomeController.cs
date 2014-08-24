using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using WPlay.Models;

namespace WPlay.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        private readonly IReadTreks readTreks;
        private readonly ICacheService cacheService;


        public HomeController(ICacheService cacheService, IReadTreks readTreks)
        {
            this.readTreks = readTreks;
            this.cacheService = cacheService;

        }


        public ActionResult Index()
        {
            ViewBag.t = readTreks.Read(); 
            return View();
        }

        public ActionResult GetTrek(string mount)
        {
            InfoAboutMount res = cacheService.GetMount(mount);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

    }
}
