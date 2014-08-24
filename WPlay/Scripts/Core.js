var Core = {};

Core.destroy = function (obj) {
    delete obj;
}

Core.ajax = function (parametrs) {

    function encodeFormData(data) {
        if (!data) {
            return "";
        }
        var pairs = [];

        for (var name in data) {
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + "=" + value);
        }
        return pairs.join('&');
    }

    var request,
        par;

    par = {};
    par.url = parametrs["url"];
    par.type = (parametrs["type"] !== undefined) ? parametrs["type"] : "GET";
    par.success = (parametrs["success"]) ? parametrs["success"] : undefined;
    par.error = (parametrs["error"]) ? parametrs["error"] : undefined;
    par.data = parametrs["data"];

    if (par.type == "GET") {
        par.url = "?" + encodeFormData(parametrs["data"]);
    }



    var request = new XMLHttpRequest();

    request.open(par.type, par.url);

    request.onreadystatechange = function () {
        console.log(request.readyState)
        if (request.readyState === 4) {

            var responsetType = request.getResponseHeader("Content-Type");
            var responseData = request.response;

            if (responsetType.indexOf("application/json") !== -1) {
                responseData = JSON.parse(request.responseText);
            }

            if (request.status == 200) {
                if (par.success) {
                    par.success(responseData);
                }
            }
            else {
                if (par.error) {
                    par.error(request.status, request.statusText);
                }
            }
        }
    }

    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(par.data));
}