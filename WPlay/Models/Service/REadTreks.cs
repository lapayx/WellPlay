using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace WPlay.Models.Service
{
    public class ReadTreks : IReadTreks
    {
        private readonly ICacheService cacheService;
        public ReadTreks(ICacheService cacheService)
        {
            this.cacheService = cacheService;

        }

        public string Read()
        {
            var xml = XDocument.Load(@"http://radio.hiteka.net:8000/link.xsl");


            var q = (from c in xml.Root.Descendants("source")
                     select
                    c
                   ).ToList();
            string res ="";
            InfoAboutMount temp;
            foreach (var c in q)
            {
                temp = new InfoAboutMount
                {
                    Bitrate = int.Parse(c.Element("bitrate").Value),
                    Name = c.Attribute("mount").Value,
                    NameTrack = c.Element("title").Value,
                    Url = c.Element("listenUrl").Value,
                    MimeType = c.Element("mime").Value
                };
                cacheService.SetMount(c.Attribute("mount").Value, temp);
            }
  
            
            return res;


        }
        
    }
}