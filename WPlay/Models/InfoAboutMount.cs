using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WPlay.Models
{
    public class InfoAboutMount
    {
        public string Name{get;set;}

        public string Url { get; set; }

        public  string NameTrack{get; set;}

        public int Bitrate { get; set; }
        public string MimeType { get; set; }
                     
    }
}