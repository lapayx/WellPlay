using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WPlay.Models;

namespace WPlay
{
    public static class CacheMount
    {
        private static Dictionary<string, InfoAboutMount> cache = new Dictionary<string, InfoAboutMount>();

        public static void Set(string mount , InfoAboutMount value)
        {
            cache[mount] = value;

        }

        public static InfoAboutMount Get(string mount)
        {
            if (cache.ContainsKey(mount))
                return cache[mount];
            else
                return null;

        }
        public static List<InfoAboutMount> All()
        {
            List<InfoAboutMount> res = new List<InfoAboutMount>();
            foreach (KeyValuePair<string, InfoAboutMount> pair in cache)
            {
                res.Add(pair.Value);
            }


            return res;

        }
    }
}