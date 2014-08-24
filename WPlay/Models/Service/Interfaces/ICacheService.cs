using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WPlay.Models
{
    public interface ICacheService
    {
        InfoAboutMount GetMount(string mount);

        List<InfoAboutMount> GetMountAll();

        void SetMount(string mount, InfoAboutMount value);



    }
}

