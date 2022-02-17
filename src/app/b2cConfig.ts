// Enter user flows and custom policies for your B2C application
export const b2cPolicies = {
    //user flows names
    names: {
        signUpSignIn: "b2c_1_susi",
        forgotPassword: "b2c_1_reset",
        editProfile: "b2c_1_edit_profile"
    },   
    authorities: {
        signUpSignIn: {
            //if you have a custom domain : https://your-domain-name/your-tenant-name.onmicrosoft.com/b2c_1_susi
            authority: "https://<your domain name>/<your-tenant-name>n.onmicrosoft.com/b2c_1_susi",
        },
        editProfile: {
             //if you have a custom domain : https://your-domain-name/your-tenant-name.onmicrosoft.com/B2C_1_edit_profile
            authority: "https://<your domain name>/<your-tenant-name>.onmicrosoft.com/B2C_1_edit_profile"
        }
    },
    //if you have a custom domain : https://your-domain-name
    authorityDomain: "https://<your domain name>"
}
