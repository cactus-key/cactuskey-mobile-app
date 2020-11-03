import { AppConstants } from "../../constants/app.constants";

export class ApiService {

    public static access_token: string = null;

    public static request(params: {
        method: string;
        path: string;
        body?: any;
        expected_code?: number;
        is_form_data?: boolean;
        ignore_unauthenticated?: boolean
    }): Promise<{status: number, json: any}> {
        // Create headers
        let headers = {
            'Accept': 'application/json',
            'Content-Type': (params.is_form_data ? 'multipart/form-data' : 'application/json')
        };

        // Load & append JWT auth token from Redux
        if(ApiService.access_token !== null) {
            headers['Authorization'] = `Bearer ${ApiService.access_token}`;
        }

        // Building request parameters
        // If formdata, append raw
        let p = {method: params.method, headers};
        if(params.method == 'POST' || params.method == 'PATCH') {
            p['body'] = (params.is_form_data ? params.body : JSON.stringify(params.body));
        }

        // Rend request
        return new Promise((resolve, reject) => {
            try {
                fetch(AppConstants.API_BASE_URL + params.path, p).then((res) => {
                    res.json().then((json) => {
                        const data = {status: res.status, json};

                        // Check if unauthenticated
                        if(!params.ignore_unauthenticated && data.status == 401 && data.json.error === "UNAUTHENTICATED") {
                            // Restart app
                            // return Store.getStore().dispatch({ type: "OPEN_AUTH_MODAL" });
                        }

                        // Check expected code
                        if(params.expected_code && params.expected_code != data.status) {
                            return reject(data);
                        }

                        resolve(data);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } catch(e) {
                console.error({myerror: e});
            }
        });
    }

}