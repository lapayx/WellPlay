/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LightInject;
using LightInject.Mvc;
using System.Reflection;
using System.Web.Mvc;
*/

using LightInject;
using LightInject.Mvc;
//using LightInject.Web;
using System.Reflection;
using System.Web.Mvc;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

using WPlay.Models.Service;
using WPlay.Models;

namespace WPlay
{

    /// <summary>
    /// Конфигурация Dependency Injection.
    /// </summary>
    public class DIConfig
    {
        /// <summary>
        /// Регистрация зависимостей.
        /// </summary>
        public static void Register()
        {
            IServiceContainer container = new ServiceContainer();
            container.RegisterControllers(Assembly.GetExecutingAssembly());

            Register(container);
            RegisterRepositores(container);
            RegisterProviders(container);
            //LightInjectHttpModule.SetServiceContainer(container);
            DependencyResolver.SetResolver(new LightInjectMvcDependencyResolver(container));
            container.EnableMvc();
        }

        internal static void RegisterRepositores(IServiceContainer container)
        {
        /*
            container.Register<Entities>(new PerScopeLifetime());

            container.Register<IRoleRepository, Entities>();
            container.Register<IAccountRepository, Entities>();
            container.Register<IMedalRepository, Entities>();
            container.Register<IVersionControlSystemRepository, Entities>();
            container.Register<IImageRepository, Entities>();
            */
         }


        internal static void RegisterProviders(IServiceContainer container)
        {
            /*
            container.Register<MedalForHeroes.Models.Providers.IMembershipProvider, MedalForHeroes.Models.Providers.MembershipProvider>();
            container.Register<MedalForHeroes.Models.Providers.IRoleProvider, MedalForHeroes.Models.Providers.RoleProvider>();
            container.Register<MedalForHeroes.Models.Auth.IAuthentication, MedalForHeroes.Models.Auth.Authentication>(new PerRequestLifeTime());
        */
         }

        internal static void Register(IServiceContainer container)
        {
            container.Register<IReadTreks, ReadTreks>();
            container.Register<ICacheService, CacheService>();
            /*
            container.Register<IImportService, ImportService>();
            container.Register<ISearchService, SearchSevice>();
            container.Register<IVcsService, VcsService>();
            container.Register<IMedalService, MedalService>();
            container.Register<IAdminService, AdminService>();
            container.Register<IAccountService, AccountService>();
            container.Register<IImageService, ImageService>();
            */
        }
 
    }

}