const ICONS_PATH = "../assets/issuers";

type Issuer = {
    name: string,
    icon: any,
    key: string;
    key_aliases: string[],
    is_default?: boolean
};

const ISSUERS: Issuer[] = [
    {
        name: "Dropbox",
        key: "Dropbox",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/dropbox.jpg`)
    },
    {
        name: "Stripe",
        key: "Stripe",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/stripe.jpg`)
    },
    {
        name: "GitHub",
        key: "GitHub",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/github.jpg`)
    },
    {
        name: "GitLab",
        key: "gitlab.com",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/gitlab.jpg`)
    },
    {
        name: "LinkedIn",
        key: "LinkedIn",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/linkedin.jpg`)
    },
    {
        name: "Amazon",
        key: "Amazon",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/amazon.jpg`)
    },
    {
        name: "Amazon Web Services",
        key: "Amazon Web Services",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/aws.jpg`)
    },
    {
        name: "NPM",
        key: "npm",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/npm.jpg`)
    },
    {
        name: "Gandi",
        key: "gandi.net",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/gandi.png`)
    },
    {
        name: "OVH",
        key: "OVH",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/ovh.jpg`)
    },
    {
        name: "Facebook",
        key: "Facebook",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/facebook.jpg`)
    },
    {
        name: "Google",
        key: "Google",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/google.jpg`)
    },
    {
        name: "Docker Hub",
        key: "hub.docker.com",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/docker.jpg`)
    },
    {
        name: "Evernote",
        key: "Evernote",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/evernote.jpg`)
    },
    {
        name: "MEGA",
        key: "MEGA",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/mega.jpg`)
    },
    {
        name: "Heroku",
        key: "Heroku",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/heroku.png`)
    },
    {
        name: "Vultr",
        key: "Vultr",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/vultr.jpg`)
    },
    {
        name: "Discord",
        key: "Discord",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/discord.jpg`)
    },
    {
        name: "Mailgun",
        key: "Mailgun",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/mailgun.jpg`)
    },
    {
        name: "Algolia",
        key: "Algolia",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/algolia.png`)
    },
    {
        name: "Zapier",
        key: "Zapier",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/zapier.png`)
    },
    {
        name: "Twilio",
        key: "Twilio",
        key_aliases: [],
        icon: require(`${ICONS_PATH}/twilio.png`)
    },
    // {
    //     name: "Slack",
    //     key: "slack",
    //     key_aliases: [],
    //     icon: require(`${ICONS_PATH}/slack.jpg`)
    // }
];

// Sort issuers by name asc
ISSUERS.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
})

export { Issuer, ISSUERS };
