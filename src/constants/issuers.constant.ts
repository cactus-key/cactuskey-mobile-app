type Issuer = {name: string, icon: any, aliases: string[], is_default?: boolean};
const ICONS_PATH = "../assets/issuers";

const ISSUERS: Issuer[] = [
    {
        name: "facebook",
        icon: require(`${ICONS_PATH}/facebook.png`),
        aliases: ["otplib-website"]
    },
    {
        name: "react-native",
        icon: require(`${ICONS_PATH}/react-native.png`),
        aliases: ["reactnative"]
    }
];

// Sort issuers by name asc
ISSUERS.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
})

export { Issuer, ISSUERS };
