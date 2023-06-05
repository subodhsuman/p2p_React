
import axios from "axios";

export default class ApiClass {
  
  // LIVE LINKS
  // static nodeUrl = 'http://192.168.11.112:5088/';
  // static baseUrl = 'http://192.168.11.112:8005/api/';

  static nodeUrl = "http://192.168.10.212:5088/";
  static nodeWebsocket = "ws://192.168.10.212:5088/";
  static baseUrl = "http://192.168.10.212:8000/api/";
  static VUE_DOMAIN = "http://192.168.10.212:8000/";

    


    //******************************* Post api *******************************************//
    static postRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.post(this.baseUrl + apiUrl, formData, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // ********************************* LARAVEL API GET REQUEST **************************************
    static getRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.get(this.baseUrl + apiUrl, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    //******************************** Update api ********************************************** */
    static updatenodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.put(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    this.unauthenticateRedirect();
                }
            });
    }

    //******************* if form data with image ************************ */

    static updateFormRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        baseParam = { "_method": "PUT" }
        if (params != null) {
            // var baseParam = $.extend(params, baseParam)
            var baseParam = Object.assign(params, baseParam)
        }
        return axios.post(this.baseUrl + apiUrl, formData, this.config(isToken, headers, baseParam)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }
    //******************* form data in json format ************************ */

    static updateRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {

        return axios.put(this.baseUrl + apiUrl, formData, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    //*********************************** Delete api *************************************************** */

    static deleteRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.delete(this.baseUrl + apiUrl, this.config(isToken, headers, params)).then(result => {
            return result
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        })
    }

    static deleteNodeRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.delete(this.nodeUrl + apiUrl, this.config(isToken, headers, params)).then((result) => {
          return result;
        }).catch((error) => {
          if (error.response.status == 401) {
            this.unauthenticateRedirect();
          }
        });
      }
    //******************************* Configrations of header and parameters ******************************* */

    static config(isToken = true, headers = null, parameters = null) {
        var defaultHeaders = {
            Accept: "application/json"
        };
        var merge = {};
        if (isToken) {
            var token = { Authorization: "Bearer " + localStorage.getItem("token") }
            // var merge = $.extend(defaultHeaders, token)
            merge = Object.assign(defaultHeaders, token)
        }
        // var merge = $.extend(defaultHeaders, headers)
        merge = Object.assign(defaultHeaders, headers)
        return {
            headers: merge,
            params: parameters
        }
    }

    //********************************* if the unautherntication Error..... ************************************** */

    static unauthenticateRedirect() {
        // localStorage.removeItem('user');
        // store.commit('setLogin', false);
        // localStorage.removeItem('token');
        // store.commit('SET_USER', null);
        // location.replace('/login');
        // this.toastMessage("error", "You are currently blocked by the admin or try to login again");
    }


    // node Api
    static getNodeRequest(apiUrl, isToken = true, headers = null, params = null) {
        return axios.get(this.nodeUrl + apiUrl, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    // ********************************* NODE API POST REQUEST ************************************** 
    static postNodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {
        return axios.post(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

    //Update node 
    static putNodeRequest(apiUrl, isToken = true, formData = null, headers = null, params = null) {

        return axios.put(this.nodeUrl + apiUrl, formData, this.config(isToken, headers, params)).then(result => {
            return result;
        }).catch(error => {
            if (error.response.status == 401) {
                this.unauthenticateRedirect();
            }
        });
    }

}
