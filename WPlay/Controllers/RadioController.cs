using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WPlay.Models;

namespace WPlay.Controllers
{
    public class RadioController : Controller
    {

        private readonly IReadTreks readTreks;
        private readonly ICacheService cacheService;


        public RadioController(ICacheService cacheService, IReadTreks readTreks)
        {
            this.readTreks = readTreks;
            this.cacheService = cacheService;

        }
        //
        // GET: /Radio/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAllMount()
        {
            var res = cacheService.GetMountAll().Select(x => new
            {
                mount = x.Name,
                bitrate = x.Bitrate,
                url = x.Url,
                mimeType = x.MimeType
            });
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCurrentTrack(string mount)
        {
            InfoAboutMount info = cacheService.GetMount(mount);
            string res = "";
            if(info!= null)
            {
                res = info.NameTrack;
            }
            return Json(new {nameTrack = res}, JsonRequestBehavior.AllowGet);
        }

    }
}
