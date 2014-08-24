using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace WPlay.Models.Service
{
    public class CacheService : ICacheService
    {
        public CacheService()
        {

        }

        public InfoAboutMount GetMount(string mount) 
        {
            return CacheMount.Get(mount);
        }

        public List<InfoAboutMount> GetMountAll() {
            return CacheMount.All();
        }
        
        public void SetMount(string mount, InfoAboutMount value)
        {
            CacheMount.Set(mount, value);
        }
    }
}