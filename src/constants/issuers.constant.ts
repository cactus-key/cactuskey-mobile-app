const ICONS_PATH = "../assets/issuers";

type Issuer = {
    name: string,
    icon: any,
    key: string;
    key_aliases: string[]
};

const ISSUERS: Issuer[] = [
    {
        name: "Dropbox",
        key: "Dropbox",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/dropbox.jpg`)
    }
];

// Sort issuers by name asc
ISSUERS.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
})

export { Issuer, ISSUERS };
